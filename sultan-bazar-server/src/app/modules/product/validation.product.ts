// // src/app/modules/project/project.validation.ts

// import { z } from 'zod';

// const projectStatusEnum = z.enum([
//   'Live',
//   'In Development',
//   'Completed',
//   'On Hold',
// ]);

// const createProjectValidationSchema = z.object({
//   body: z.object({
//     title: z.string({ 
//       message: 'Title must be a string' 
//     }),
//     description: z.string({ 
//       message: 'Description must be a string' 
//     }),
//     technologies: z
//       .array(z.string(), { 
//         message: 'Technologies must be an array' 
//       })
//       .min(1, 'At least one technology is required'),
//     category: z.string({ 
//       message: 'Category must be a string' 
//     }),
//     image: z
//       .string({ 
//         message: 'Image URL must be a string' 
//       })
//       .url('Image must be a valid URL'),
    
//     // These are fine
//     gallery: z
//       .array(z.string().url('Each gallery image must be a valid URL'))
//       .optional(),
//     liveUrl: z.string().url('Live URL must be a valid URL').optional(),
//     githubClient: z
//       .string()
//       .url('GitHub Client URL must be a valid URL')
//       .optional(),
//     githubServer: z
//       .string()
//       .url('GitHub Server URL must be a valid URL')
//       .optional(),
//     status: projectStatusEnum.optional(),
//   }),
// });


// const updateProjectValidationSchema = z.object({
//   body: createProjectValidationSchema.shape.body.partial(),
// });

// export const projectValidations = {
//   createProjectValidationSchema,
//   updateProjectValidationSchema,
// };