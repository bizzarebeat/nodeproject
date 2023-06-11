module.exports = (sequelize, Sequelize) => {
    
    const user = sequelize.define("user", {
      name: {
        type: Sequelize.STRING
      },
      surname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      count: {
        type: Sequelize.INTEGER
      }
      
    });
    return user;
  
};
  