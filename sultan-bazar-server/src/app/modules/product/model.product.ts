// import { Schema, model } from 'mongoose';

// const projectSchema = new Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   technologies: [{ type: String, required: true }],
//   category: { type: String, required: true },
//   image: { type: String}, // Main image URL
//   gallery: [{ type: String }],
//   liveUrl: { type: String },
//   githubClient: { type: String },
//   githubServer: { type: String },
//   status: {
//     type: String,
//     enum: ['Live', 'In Development', 'Completed', 'On Hold'],
//     default: 'In Development',
//   },
// }, { timestamps: true });

// export const Projects = model('Project', projectSchema);