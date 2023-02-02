const db = require('_helpers/db');
const Department = db.Department;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Department.find();
}

async function getById(id) {
    return await Department.findById(id);
}

async function create(userParam) {
    // validate
    if (await Department.findOne({ departmentname: userParam.departmentname })) {
        throw 'Department name "' + userParam.departmentname + '" is already taken';
    }

    const department = new Department(userParam);

    // save Department
    await department.save();
}

async function update(id, userParam) {
    const department = await Department.findById(id);
//console.log(department);
    // validate
    if (!department)
     throw 'Department not found';
    if (department.departmentname !== userParam.departmentname && await Department.findOne({ departmentname: userParam.departmentname })) {
        throw 'Department name "' + userParam.departmentname + '" is already taken';
    }
    Object.assign(department, userParam);
    
    await department.save();
}

async function _delete(id) {
    await Department.findByIdAndRemove(id);
}