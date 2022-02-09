module.exports = (sequelize, Sequelize) => {
    const EventType = sequelize.define("event_type", {
        event_type_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        event_type: {
            type: Sequelize.STRING
        }
    });
    return EventType;
};    