const webSocket = require("ws");
const db = require("..");

const Computer = db.computer;
const Session = db.session;
const Event = db.event;

const utils = require("../config/utils.js");

const wsServerForQueue = new webSocket.Server({
  port: 9001
});
//A dictionary mapping userIds to their associated websocket.
const userIdToWebsocketDict = {};
//A dictionary mapping computerIds to it's associated queue of users waiting for it to become available.
var queue = {};
initQueue();

async function initQueue() {
  var computers = await Computer.findAll();
  for (var computer of computers) {
    if(!queue[computer.computerId]) {
      queue[computer.computerId] = [];
    }
  }
}

wsServerForQueue.on("connection", (ws) => {
  ws.on("message", async (message) => {
    message = JSON.parse(message.toString());
    if(!utils.isMessageValid(message, {messageType: ""})) return;
    if (message.messageType === "websocket-queue-initialization-message") {
      if(!utils.isMessageValid(message, {userId: ""})) return;
      var userId = message.userId;
      //If this user doesn't have a websocket associated with them, add them to the dictionary.
      if (userIdToWebsocketDict[userId]) return;
      userIdToWebsocketDict[userId] = ws;
      ws.userId = userId;
      await sendQueueDataToWebsocket(ws);
    } else if(message.messageType === "join-queue") {
      if(!utils.isMessageValid(message, {computerId: ""})) return;
      var computerId = message.computerId;
      var userId = ws.userId;
      if(userId == undefined) {
        console.log("A websocket does not have a userId associated. This is a problem. join-queue");
        return;
      }
      //Add the user to the computer queues they wanted to join.
      await joinQueue(userId, computerId);
    } else if (message.messageType === "exit-queue") {
      if(!utils.isMessageValid(message, {computerId: ""})) return;
      var computerId = message.computerId;
      var userId = ws.userId;
      if(userId == undefined) {
        console.log("A websocket does not have a userId associated. This is a problem. exit-queue");
        return;
      }
      //Remove the user from the computer queues they wanted to exit.
      await exitQueue(ws.userId, computerId);
    }
  });

  //This gets called when the user closes out or is granted a computer.
  ws.on("close", async () => {
    var userId = ws.userId;
    if(userId == undefined) {
      console.log("A websocket does not have a userId associated. This is a problem. close");
      return;
    }
    await exitQueue(userId, "all");
    delete userIdToWebsocketDict[userId];
  });
});

//Give updated queue data to all users waiting in a queue.
async function updateAllQueueUsers() {
  for (const [userId] of Object.entries(userIdToWebsocketDict)) {
    let ws = userIdToWebsocketDict[userId];
    await sendQueueDataToWebsocket(ws);
  }
}

async function sendQueueDataToWebsocket(ws) {
  await ws.send(JSON.stringify({
    messageType: "queue-data",
    queue: queue
  }));
}

//Grant a user a computer they were waiting for. We do this by sending them a message which instructs the frontend to move to the TerminalPage.
async function giveComputerToUser(computerId, userId) {
  let ws = userIdToWebsocketDict[userId];
  await ws.send(JSON.stringify({
    messageType: "granted-computer",
    computerId: computerId
  }));
}

async function getComputersToJoinOrExit(computerId) {
  var computersToJoinOrExit = [];
  if (computerId === "all") {
    var computers = await Computer.findAll();
    for (var computer of computers) {
      computersToJoinOrExit.push(computer.computerId);
    }
  } else {
    computersToJoinOrExit.push(computerId);
  }
  return computersToJoinOrExit;
}

async function exitQueue(userId, computerId) {
  if(userId == undefined) return;
  computersToExit = await getComputersToJoinOrExit(computerId);
  //For each computer in the computers to join, add the user to the respective computer queue.
  for (var computerId of computersToExit) {
    if (queue[computerId] && queue[computerId].includes(userId)) {
      await Event.create({
        eventTypeId: utils.EXITED_QUEUE_EVENT_ID,
        userId: userId,
        data: JSON.stringify({
          queueComputerId: computerId,
          numUsersWaiting: queue[computerId].length
        }),
      });
      queue[computerId].splice(queue[computerId].indexOf(userId), 1);
    }
  }
  //Inform all users the queues have been updated.
  await updateAllQueueUsers();
}

async function joinQueue(userId, computerId) {
  if(userId == undefined) return;
  computersToJoin = await getComputersToJoinOrExit(computerId);
  //See if they already have a session.
  let session = await Session.findOne({
    where: {
      userId: userId,
      endTime: null,
    },
    order: [
      ["startTime", "DESC"]
    ],
  }).then((session) => {
    return session;
  });
  if (session) {
    let ws = userIdToWebsocketDict[userId];
    await ws.send(
      JSON.stringify({
        messageType: "message-to-display",
        body: "You cannot join a queue when you already have a computer. You currently already have computerId=" + session.computerId,
      })
    );
    return;
  }
  //For each computer in the computers to join, add the user to the respective computer queue.
  for (var computerId of computersToJoin) {
    //If we don't have a queue for the specific computerId, create an empty one.
    if (!queue[computerId]) {
      queue[computerId] = [];
    }
    if (!queue[computerId].includes(userId)) {
      await Event.create({
        eventTypeId: utils.JOINED_QUEUE_EVENT_ID,
        userId: userId,
        data: JSON.stringify({
          queueComputerId: computerId,
          numUsersWaiting: queue[computerId].length
        }),
      });
      queue[computerId].push(userId);
    }
  }
  //Inform all users the queues have been updated.
  await updateAllQueueUsers();
}

//Looks through the computers table and if one is available, it grants access to the first user in the queue.
async function checkForOpenComputers() {
  computers = await Computer.findAll();
  for (var computer of computers) {
    computerId = computer.computerId;
    if (!computer.inUse) {
      //If there is a queue and it has users in it, then give the computer to the first user.
      if (queue[computerId] && queue[computerId].length > 0) {
        userId = queue[computerId][0];
        await giveComputerToUser(computerId, userId);
        await exitQueue(userId, "all");
      }
    }
  }
}

async function logStateOfQueue() {
  await Event.create({
    eventTypeId: utils.STATE_OF_QUEUE_LOGGING_EVENT_ID,
    userId: -1,
    data: JSON.stringify({
      queue
    }),
  });
}

//Check for open computers every half second.
setInterval(() => {
  checkForOpenComputers();
}, 500);

//Log state of computers queue every minute.
setInterval(() => {
  logStateOfQueue();
}, 60000);