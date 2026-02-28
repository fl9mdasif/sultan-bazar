// import httpStatus from 'http-status';
// import catchAsync from '../../utils/catchAsync';
// import { ProjectServices } from './service.projects';
// import { response } from '../../utils/sendResponse';
// import { RequestHandler } from 'express';
// import { Projects } from './model.projects';
 

// // create course
// const createProject: RequestHandler = async (req, res) => {
//   const result = await ProjectServices.createProject(req.body);

//   response.createSendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Project created Successfully',
//     data: result,
//   });
// };

// // get all course
// const getAllProjects = catchAsync(async (req, res) => {

//   const result = await ProjectServices.getAllProjects(req.query);


//   response.getSendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
    
//     message: 'Projects retrieved successfully',
//     data: result,
//   });
// });

// // delete project
// const deleteProject = catchAsync(async (req, res) => {
//   const { projectId } = req.params;

//   const resp = await ProjectServices.deleteProjects(projectId);

//   response.createSendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Project deleted successfully',
//     data: resp,
//   });
// });

// // Get singleShoe
// const getSingleProject = catchAsync(async (req, res) => {
//   const { projectId } = req.params;

//   const result = await ProjectServices.getSingleProject(projectId);

//   response.createSendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Project retrieved successfully',
//     data: result,
//   });
// });

// // update
// const updateProject = catchAsync(async (req, res) => {
//   const { projectId } = req.params;
//   const updatedData = req.body;

//   // console.log('update',updatedData)

//   const result = await ProjectServices.updateProject(projectId, updatedData);

//   response.createSendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Project updated successfully',
//     data: result,
//   });
// });



// export const projectControllers = {
//   createProject,
//   getAllProjects,
//   deleteProject,
//   getSingleProject,
//   updateProject,
  
// };
