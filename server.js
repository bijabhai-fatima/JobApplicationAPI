const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.MONGODB_CONNECTION_URL).then(() => console.log('Connected to MongoDB!'))
.catch((err) => console.error('MongoDB connection error:', err));

const JobApplicationSchema = mongoose.Schema({
    role: String,
    company: String,
    appliedDate: Date,
    status: Number,
    link: String
})
const JobApplicationModel = mongoose.model("Job Applications", JobApplicationSchema)

const port = 8000;


const STATUS_MAP = {
    0: 'applied',
    1: 'interview',
    2: 'offer',
    3: 'rejected',
  };

  const STATUS_LABEL_TO_CODE = {
    applied: 0,
    interview: 1,
    offer: 2,
    rejected: 3,
  };

app.get('/applications', async (req, res) => {
    try {
        const applications = await JobApplicationModel.find();
        const mapped = applications.map(app => ({
            ...app.toObject(),
            statusLabel: STATUS_MAP[app.status]
          }));
        res.status(200).json(mapped);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch job applications' });
      }
    
})

  app.get('/applications/status/:status', async (req, res) => {
    const { statusLabel } = req.params;
  const statusCode = STATUS_MAP[statusLabel.toLowerCase()];

  if (statusCode === undefined) {
    return res.status(400).json({ error: 'Invalid status. Use applied, interview, offer, or rejected.' });
  }

  try {
    const applications = await JobApplicationModel.find({ status: statusCode });

    const mapped = applications.map(app => ({
      ...app.toObject(),
      statusLabel: statusLabel.toLowerCase(),
    }));

    res.status(200).json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications by status' });
  }
  });

  app.get('/applications/range', async (req, res) => {
    const { start, end } = req.query;
  
    // Validate date inputs
    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates are required in query parameters' });
    }
  
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
  
    try {
      const applications = await JobApplicationModel.find({
        appliedDate: {
          $gte: startDate,
          $lte: endDate
        }
      });

      const mapped = applications.map(app => ({
        ...app.toObject(),
        statusLabel: STATUS_MAP[app.status]
      }));
  
      res.status(200).json(mapped);
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch applications by date range' });
    }
  });
  
  app.post('/applications', async (req, res) => {
    const { role, company, appliedDate, status, link } = req.body;
  
    // Optional: basic validation
    if (!role || !company || !appliedDate  || !link || typeof status !== 'number') {
      return res.status(400).json({ error: 'role, company, appliedDate, and numeric status are required' });
    }
  
    try {
      const newApplication = new JobApplicationModel({
        role,
        company,
        appliedDate: new Date(appliedDate),
        status,
        link
      });
  
      const savedApplication = await newApplication.save();
      res.status(201).json(savedApplication);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add new application' });
    }
  });

  app.delete('/applications/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedApp = await JobApplicationModel.findByIdAndDelete(id);
  
      if (!deletedApp) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      res.status(200).json({ message: 'Application deleted successfully', data: deletedApp });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete application' });
    }
  }); 
  
  app.patch('/applications/status', async (req, res) => {
    const { id, status } = req.body;
  
    if (!id || !status) {
      return res.status(400).json({ error: 'Both id and status are required' });
    }
  
    const statusCode = STATUS_LABEL_TO_CODE[status.trim().toLowerCase()];
     
    if (statusCode === undefined) {
      return res.status(400).json({ error: 'Invalid status string provided' });
    }
  
    try {
      const updatedApp = await JobApplicationModel.findByIdAndUpdate(
        id,
        { status: statusCode },
        { new: true }
      );
  
      if (!updatedApp) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      res.status(200).json({
        ...updatedApp.toObject(),
        statusLabel: status.toLowerCase(),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update application status' });
    }
  });
    
  
app.get('/applications/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const application = await JobApplicationModel.findById(id);
  
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      
      const mapped = applications.map(app => ({
        ...app.toObject(),
        statusLabel: STATUS_MAP[app.status]
      }));

      res.status(200).json(mapped);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch application' });
    }
  });

  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })