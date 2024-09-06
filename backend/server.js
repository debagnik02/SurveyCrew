const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cors = require("cors");
const connectDB = require("./config/db")
const mongoose = require('mongoose')
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const User = require('./models/userModel')
const {Survey, Response} = require('./models/surveyModel')


connectDB();

const PORT = process.env.PORT || 5000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


app.get('/authCheck',(req,res)=> {
  console.log('entered')
  const token = req.cookies.jwt; // Access the token from cookies

  if (!token) {
    return res.send({isAuthenticated:false});
  }
  console.log('token present')

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.send({isAuthenticated:false});
    }
  console.log('token verified')
    // Token is valid, proceed with the request
    res.send({ isAuthenticated:true});

})})
const generatePassword = () => {
  return crypto.randomBytes(4).toString('hex');
}
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, phoneNumber } = req.body;
        const users = await User.find({ email: email })
        console.log(users)
        if (users.length)
            return res.send({
                registered: false,
                message: 'Account already exists'
            })
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name: fullName,
            email: email,
            password: hashedPassword,
            phone: phoneNumber,
            surveys: []
        };
        console.log(newUser)
        const createdUser = await User.create(newUser);
        console.log(createdUser)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
            auth: {
                user: "thesurveycreww@gmail.com",
                pass: "cerr ssvr ymuf lqkm",
            },
        });

        const mailOptions = {
            from: "SurveyCrew",
            to: email,
            subject: "Account Credentials",
            html: `
                <html>
                <head>
                <style>
                 body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 20px;
                      }
                .container {
                     max-width: 600px;
                     margin: auto;
                     background: #fff;
                     padding: 20px;
                     border-radius: 8px;
                     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
            h1 {
                    color: #007bff;
                  }
               p {
            font-size: 16px;
              }
          .info {
            background: #e9ecef;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
          }
          .footer {
            font-size: 12px;
            color: #888;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hey ${fullName}!</h1>
          <p>Here are your account details:</p>
          <div class="info">
            <p><strong>Email:</strong> <span>${email}</span></p>
            <p><strong>Password:</strong> <span>${password}</span></p>
          </div>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Thank you for using our service!</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Our Service. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `,

        };
        console.log('sending')
        await transporter.sendMail(mailOptions);
        console.log('sent')
        return res.send({
            registered: true,
            message: 'Successfully registered. Check mail for password.'
        })
        
    }
    catch (e) {
      console.log(e);
        return res.status(200).send({
            registered: false,
            message: 'Error registering user. Please try again.'
        })
    }
})
app.post('/api/loginCheck', async (req, res) => {

    const { email, password } = req.body;
    const validUser = await User.findOne({ email: email });
    if (validUser == null) {
        return res.json({ auth: false});
    }
    const passwordIsValid = bcrypt.compareSync(password, validUser.password);
    if (!passwordIsValid) {
        return res.json({ auth: false});
    }
    
    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET, { expiresIn: 86400 }); // 24 hours
    console.log('making cookie')
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    })
    console.log('made cookie')
    res.json({ auth: true,  name: validUser.name, email: validUser.email});

})
app.post("/api/logout", async (req, res) => {
  try {
    console.log('logging out');
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      expires: new Date(0),
      
    });
    return res.json({ status: 'success' });
  } catch (e) {
    console.error('Logout failed:', e);
    return res.json({ status: 'failure' });
  }
});

app.post("/api/createSurvey",async (req,res)=>{
  try {
    const { title, description, questions, email } = req.body;

    // Create a new survey
    const survey = new Survey({
      title,
      description,
      createdByEmail: email, // Storing the user's email
      questions
    });
    console.log(survey)
    // Save the survey to the database
    const savedSurvey = await survey.save();
    console.log(savedSurvey)
    // Update the user's surveys array with the new survey's ID
    await User.findOneAndUpdate(
      { email: email }, // Find the user by email
      { $push: { surveys: savedSurvey._id } } // Add the survey ID to the surveys array
    );

    // Respond with success
    res.json({ success:true, message: 'Survey created successfully', surveyId: savedSurvey._id });
  } catch (error) {
    console.error('Error creating survey:', error);
    res.json({success:false});
  }
})
app.get('/api/surveys', async (req,res)=>{
  try {
    // Fetch all surveys from the database
    const surveys = await Survey.find(); // Optionally, you can add sorting, pagination, etc.
    
    // Respond with the list of surveys
    res.json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
app.get('/api/survey/:id', async (req, res) => {
  const surveyId = req.params.id;

  try {
    // Find the survey by ID
    console.log(surveyId)
    const survey = await Survey.findById(surveyId).exec();
    
    if (!survey) {
      return res.json({found:false, message: 'Survey not found' });
    }

    // Respond with the survey details
    res.json({found:true, survey:survey});
  } catch (error) {
    console.error('Error retrieving survey:', error);
    res.status(500).json({found:false, message: 'Internal server error' });
  }
});

app.post('/api/submitResponse', async (req, res) => {
  const { surveyId, responses } = req.body;

  try {
    // Convert responses to the format expected by the schema
    const formattedAnswers = Object.entries(responses).map(([questionIndex, answer]) => {
      // Check if answer is an object (list of indexes for multiple-choice/check boxes)
      if (typeof answer === 'object' && answer !== null && !Array.isArray(answer)) {
        return {
          question: questionIndex, // Use questionIndex as string
          answer: Object.keys(answer) // Convert answer object to an array of indexes
        };
      } else {
        return {
          question: questionIndex, // Use questionIndex as string
          answer: answer // Directly use the string value for text responses
        };
      }
    });

    // Create a new response document
    const newResponse = new Response({
      survey: surveyId,
      answers: formattedAnswers,
      submittedAt: new Date()
    });

    // Save the response to the database
    await newResponse.save();

    // Send a success response
    res.json({ submit: true });
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ error: 'Failed to submit survey response' });
  }
});

app.post('/api/user-surveys', async (req, res) => {
  console.log('Received request with body:', req.body); // Log request body
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const surveys = await Survey.find({ createdByEmail: email });
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving surveys' });
  }
});








app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})
