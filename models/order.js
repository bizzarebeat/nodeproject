module.exports = (sequelize, Sequelize) => {
    
    const order = sequelize.define("order", {
      tracking: {
        type: Sequelize.INTEGER
      },
      client: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      }
    });
    return order;
  
};
  