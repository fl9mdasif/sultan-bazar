

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import AppError from '../../errors/AppErrors'; 
// import httpStatus from 'http-status';
// import { TProject } from './interface.projects';
// import { Projects } from './model.projects';

// // 1. Create a new project
// const createProject = async (projectData: TProject) => {
//   const result = await Projects.create(projectData);
//   return result;
// };

// // 2. Get all projects with filtering, sorting, and pagination
// const getAllProjects = async (payload: Record<string, unknown>) => {
//   try {
   
//     const {
//       page = 1,
//       limit = 10,
//       sortBy = 'createdAt',  
//       sortOrder = 'desc',  
//       title,
//       technology, 
//       category,
//       status,
//       createdAfter,  
//     } = payload;

 
//     const filter: any = {};

//     if (title) {
//       filter.title = { $regex: new RegExp(title as string, 'i') };
//     }
//     if (category) {
//       filter.category = { $regex: new RegExp(category as string, 'i') };
//     }
//     if (status) {
//       filter.status = { $regex: new RegExp(status as string, 'i') };
//     }
//     if (technology) {
//       filter.technologies = { $regex: new RegExp(technology as string, 'i') };
//     }
//     if (createdAfter) {
//       const releaseDate = new Date(createdAfter as string);
//       if (!isNaN(releaseDate.getTime())) {
//         filter.createdAt = { $gte: releaseDate };
//       }
//     }
    
//     const sort: Record<string, any> = {};
//     sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

//     const skip = (Number(page) - 1) * Number(limit);

//     const result = await Projects.find(filter)
//       .sort(sort)
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await Projects.countDocuments(filter);

//     return {
//       meta: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//       },
//       data: result,
//     };
//   } catch (err: any) {
//     throw new Error(err.message);
//   }
// };

// // 3. Get a single project by ID
// const getSingleProject = async (id: string) => {
//   const result = await Projects.findById(id);

//   if (!result) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Project not found with this ID');
//   }
  
//   return result;
// };

// // 4. Delete one or more projects by ID(s)
// const deleteProjects = async (id: string) => {
//   const result = await Projects.deleteOne({ _id: id });

//   if (result.deletedCount === 0) {
//      throw new AppError(httpStatus.NOT_FOUND, 'No projects found to delete');
//   }

//   return result;
// };

// // 5. Update a project
// const updateProject = async (id: string, updatedData: Partial<TProject>) => {
//   const result = await Projects.findByIdAndUpdate(
//     id,
//     { $set: updatedData },
//     { new: true, runValidators: true } 
//   );

//   if (!result) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       'Failed to update project. Project not found.',
//     );
//   }

//   return result;
// };

// export const ProjectServices = {
//   createProject,
//   getAllProjects,
//   getSingleProject,
//   updateProject,
//   deleteProjects,
// };