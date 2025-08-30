const { User } = require('../database/models');
const bcrypt = require('bcrypt');

class OrmTestController {

    async ormQueryTestSaveInDB(req, res, next) {
        try {

            const responseStructure = {};
            responseStructure.status = 'success';
            responseStructure.statusCode = 201;
            responseStructure.message = 'this the success message';
            responseStructure.data = {};


            // get the request payload
            const requestData = req.body;

            // WAY - 1 ==> create a model instance and save data
            const userModelInstance = User.build({
                first_name: requestData.first_name,
                last_name: requestData.last_name,
                email: requestData.email,
                password: await bcrypt.hash(requestData.password, 10)
            });

            // show unsaved model values in json format in CMD console
            console.log(userModelInstance.toJSON());

            // WAY - 2 ===> save data conditionally using model instance
            const userData = {};

            if (requestData.first_name) {
                userData.first_name = requestData.first_name;
            }
            if (requestData.last_name) {
                userData.last_name = requestData.last_name;
            }
            if (requestData.email) {
                userData.email = requestData.email;
            }
            if (requestData.password) {
                userData.password = await bcrypt.hash(requestData.password, 10);
            }

            const userModelInstanceConditional = User.build(userData);

            // WAY - 3 ===> create a model instance and save data with spread operator
            const userModelInstanceSpread = User.build({
                ...(requestData.first_name && { first_name: requestData.first_name }),
                ...(requestData.last_name && { last_name: requestData.last_name }),
                ...(requestData.email && { email: requestData.email }),
                ...(requestData.password && { password: await bcrypt.hash(requestData.password, 10)})
            });

            // WAY - 4 ===> saved data using create method
            const userCreateMethod = await User.create({
                first_name: requestData.first_name,
                last_name: requestData.last_name,
                email: requestData.email,
                password: await bcrypt.hash(requestData.password, 10)
            });
            console.log(userCreateMethod.toJSON());

            // WAY - 5 ===> saved data using create method with update
            const userCreateUpdateMethod = await User.create({
                first_name: requestData.first_name,
                last_name: requestData.last_name,
                email: requestData.email,
                password: await bcrypt.hash(requestData.password, 10)
            });
            if (userCreateUpdateMethod && userCreateUpdateMethod.id) {
                userCreateUpdateMethod.status = 1;
                userCreateUpdateMethod.gender = 'male'
                // or use like below
                // userCreateUpdateMethod.set({
                //     status: 1,
                //     gender: 'male'
                // });
                //userCreateUpdateMethod.save();

                //userCreateUpdateMethod.save({ fields: ['status', 'gender']});
            } 

            /** 
                const user = await User.create(
                    {
                        username: 'alice123',
                        isAdmin: true,
                    },
                    { fields: ['username'] },
                );

                const users = await User.findAll();

                https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
            **/

            //const createNewUser = await userModelInstance.save();
            //const createNewUser = await userModelInstanceConditional.save();
            //const createNewUser = await userModelInstanceSpread.save();
            //const createNewUser = userCreateMethod;
            const createNewUser = userCreateUpdateMethod;

            if (createNewUser && createNewUser.id) {
                responseStructure.data = createNewUser;
            }

            /**
             * default status 200
             * we can also set the status explicitly, like here 201
             */
            res.status(201).json(responseStructure);
        } catch (err) {
            console.log(err.name);
            if (err.name === "SequelizeUniqueConstraintError") {
                console.error("Email already exists!");
                // handle gracefully, maybe return error response
            }
            next (err);
        }
    }

    async ormQueryTestGetFromDB(req, res, next) {

        try {

            const responseStructure = {};
            responseStructure.status = 'success';
            responseStructure.statusCode = 201;
            responseStructure.message = 'this the success message';
            responseStructure.data = {};

            const userId = req.params.id;

            // Fetch user with default scope in model
            const user = await User.findByPk(userId);
            console.log(user.toJSON());
            responseStructure.data = user;

            const userWithAll = await User.scope("withPassword").findByPk(userId);
            responseStructure.data = userWithAll;

            res.status(201).json(responseStructure);

        } catch (err) {
            next(err);
        }
    }
}

module.exports = OrmTestController;

//module.exports = new OrmTestController();