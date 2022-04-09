
const webSocket = require('ws');
const db = require("..");

const Computer = db.computer;
const Session = db.session;

const wsServerForQueue = new webSocket.Server({ port: 9001 });
const userIdToWebsocketDict = {};
var queue = {};

wsServerForQueue.on("connection", async (ws) => {
  ws.on("message", async (message) => {
    message = message.toString();
    if (message.includes("websocket-queue-initialization-message:")) {
      var computerToJoin = message.split(":")[1];
      var userId = message.split(":")[2];
      var computersToJoin = [];
      if(computerToJoin === "any") {
        var computers = await Computer.findAll();
        for(var computer of computers) {
          computersToJoin.push(computer.computerId);
        }
      } else {
        computersToJoin.push(computerToJoin);
      }
      if (!userIdToWebsocketDict[userId]) {
        userIdToWebsocketDict[userId] = ws;
        ws.userId = userId;
      }
      await joinQueue(userId, computersToJoin);
    } 
    console.log("Message received from frontend: " + message);
  });

  ws.on("close", async () => {
    var userId = ws.userId;
    await removeUserFromAllQueues(userId);
    delete userIdToWebsocketDict[userId];
  });
});

function updateAllQueueUsers() {
  for (const [userId] of Object.entries(userIdToWebsocketDict)) {
    let ws = userIdToWebsocketDict[userId];
    ws.send("queue-data:/:" + JSON.stringify(queue));
  }
}

async function giveComputerToUser(computerId, userId) {
  let ws = userIdToWebsocketDict[userId];
  ws.send("Granted computerId=" + computerId);
  await ws.close();
}

async function joinQueue(userId, computersToJoin) {
  let session = await Session.findOne({
    where: {
      userId: userId,
      endTime: null,
    },
    order: [["startTime", "DESC"]],
  }).then((session) => {
    return session;
  });
  if(session) {
    userIdToWebsocketDict[userId].send("message-to-display:You cannot join a queue when you already have a computer.")
    return;
  }
  for(var computerId of computersToJoin) {
    if(!queue[computerId]) { queue[computerId] = []; }
    if(!queue[computerId].includes(userId)) {
      var computer = await Computer.findByPk(computerId);
      computer.numUsersWaiting += 1;
      await computer.save();
      queue[computerId].push(userId);
    }
  }
  await updateAllQueueUsers();
  await checkForOpenComputers();
}

async function checkForOpenComputers() {
  computers = await Computer.findAll();
  for(var computer of computers) {
    computerId = computer.computerId;
    if(!computer.inUse) {
      if(queue[computerId] && queue[computerId].length > 0) {
        userId = queue[computerId][0];
        await giveComputerToUser(computerId, userId);
      }
    }
  }
}

async function removeUserFromAllQueues(userId) {
  for (const [computerId] of Object.entries(queue)) {
    if(queue[computerId].includes(userId)) {
      var computer = await Computer.findByPk(computerId);
      computer.numUsersWaiting -= 1;
      await computer.save();
      queue[computerId].splice(queue[computerId].indexOf(userId),1);
    }
  }
  await updateAllQueueUsers();
}

setInterval(() => {
  checkForOpenComputers();
}, 500);
