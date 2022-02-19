module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define("event", {
        event_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        event_type_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
    }, {
        updatedAt: false
    });
    return Event;
};    