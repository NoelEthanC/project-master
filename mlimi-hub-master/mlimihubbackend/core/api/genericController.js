const { sendMail } = require('../../helpers/Emailer');
const axios = require('axios');
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
exports.getResources = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    const { returnFields, page = 1, limit = 10, sortBy, order, search } = req.query;

    let filterQuery = {};
    let selectFields = '';
    let sortOrder = 1; // Default sort order is ascending

    // Construct the general search query
    if (search) {
      filterQuery = {
        $text: {
          $search: search
        }
      };
    }

    if (returnFields) {
      selectFields = returnFields.split(',').join(' ');
    }

    // Ensure the _id field is excluded
    if (selectFields && !selectFields.includes('_id')) {
      selectFields += ' -_id';
    }

    // Check if order is specified and set the sort order accordingly
    if (order && order.toLowerCase() === 'desc') {
      sortOrder = -1;
    }

    const totalCount = await resourceModel.countDocuments(filterQuery);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let dbQuery = resourceModel.find(filterQuery);

    if (selectFields) {
      dbQuery = dbQuery.select(selectFields);
    }

    // Apply sorting if sortBy field is provided
    if (sortBy) {
      dbQuery = dbQuery.sort({ [sortBy]: sortOrder });
    }

    dbQuery = dbQuery.skip(startIndex).limit(limit);

    const resources = await dbQuery.lean();

    // Map the "_id" field to "id" in the response
    const modifiedResources = resources.map(resource => {
      resource.id = resource._id;
      delete resource._id;
      return resource;
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasLastPage = page > 1;

    const pagination = {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage,
      hasLastPage
    };

    return res.status(200).json({ pagination, data: modifiedResources });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "An error occurred while fetching resources" });
  }
};


exports.getMyResourceById = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    const { field, id } = req.query;
    let filterQuery = {};

    // If the field is "_id", search directly by the id
    if (field === "_id") {
      // Check if the id is a valid ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
      if (isValidObjectId) {
        filterQuery._id = new mongoose.Types.ObjectId(id);
      } else {
        // If it's not a valid ObjectId, return an error
        return res.status(400).json({ error: "Invalid resource ID" });
      }
    } else {
      // Otherwise, search by the specified field
      if (mongoose.Types.ObjectId.isValid(id)) {
        filterQuery[field] = new mongoose.Types.ObjectId(id);
      } else {
        filterQuery[field] = id;
      }
    }

    let dbQuery = resourceModel.find(filterQuery);
    dbQuery = dbQuery.sort({ updatedAt: -1 });
    const resources = await dbQuery.lean();

    const modifiedResources = resources.map(resource => {
      resource.id = resource._id;
      delete resource._id;
      return resource;
    });

    return res.status(200).json({ data: modifiedResources });
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    res.status(500).json({ error: "An error occurred while fetching resource by ID" });
  }
};


exports.createResources = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    // Check if the request body is an array for bulk inserts
    if (Array.isArray(req.body)) {
      // Insert multiple documents in bulk
      const insertedResources = await resourceModel.insertMany(req.body);
      res.status(201).json(insertedResources);
    } else {
      // Insert a single document
      const newResource = new resourceModel(req.body);
      const createdResource = await newResource.save();
      res.status(201).json(createdResource);
    }
  } catch (error) {
    console.error("Error creating resources:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
};

exports.updateResources = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    const { id } = req.params;
    const { body } = req;

    // Check if the request body is an array for bulk updates
    if (Array.isArray(body)) {
      // Bulk updates
      const updatedResources = await Promise.all(
        body.map(async (update) => {
          const updatedResource = await resourceModel.findByIdAndUpdate(
            update._id,
            update,
            { new: true }
          );
          return updatedResource;
        })
      );

      res.status(200).json(updatedResources);
    } else {
      // Single update
      const updatedResource = await resourceModel.findByIdAndUpdate(id, body, {
        new: true,
      });

      if (!updatedResource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      res.status(200).json(updatedResource);
    }
  } catch (error) {
    console.error("Error updating resources:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
};




exports.getResourceById = async (req, res) => {
  // Extract the resource model from the request
  const resourceModel = req.resourceModel;

  try {
    // Destructuring query parameters from the request
    const { field, id } = req.query;

    let filterQuery = {}; // Initialize an empty filter query

    // Construct the query
    filterQuery[field] = mongoose.Types.ObjectId(id);

    // Create the initial query to the database
    let dbQuery = resourceModel.find(filterQuery);

    // Sort by updatedAt in descending order
    dbQuery = dbQuery.sort({ updatedAt: -1 });

    // Execute the database query and convert the result to plain JavaScript objects
    const resources = await dbQuery.lean();

    // Map the "_id" field to "id" in the response
    const modifiedResources = resources.map(resource => {
      resource.id = resource._id;
      delete resource._id;
      return resource;
    });

    // Send the response
    return res.status(200).json({ data: modifiedResources });
  } catch (error) {
    // Handle errors
    console.error("Error fetching resource by ID:", error);
    res.status(500).json({ error: "An error occurred while fetching resource by ID" });
  }
};


// DELETE /resources/:id
exports.deleteResource = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    const { id } = req.params;
    const deletedResource = await resourceModel.findByIdAndDelete(id);

    if (!deletedResource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.status(204).end(); // 204 No Content for successful deletion
  } catch (error) {
    console.log("Error deleting resource:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
};


// DELETE /resources
// Request body: [id1, id2, id3, ...]
exports.deleteResources = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    // Check if the request body contains IDs for bulk deletion
    if (Array.isArray(req.body)) {
      // Bulk deletion
      const deletedResources = await resourceModel.deleteMany({
        _id: { $in: req.body },
      });

      if (deletedResources.deletedCount === 0) {
        return res.status(404).json({ error: "Resources not found" });
      }

      res.status(200).json(deletedResources);
    } else {
      return res.status(400).json({
        error: "Invalid request data. Specify valid IDs in the request body.",
      });
    }
  } catch (error) {
    console.log("Error deleting resources:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
};


exports.getResourceById = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    const { id } = req.params;
    const resource = await resourceModel.findById(id).lean();

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    return res.status(200).json(resource);
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    res.status(500).json({ error: "An error occurred while fetching resource" });
  }
};



exports.searchResources = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    // Example: Filtering resources based on 'category' field
    const { category } = req.query;
    const query = category ? { category } : {};

    const resources = await resourceModel.find(query).lean();

    return res.status(200).json(resources);
  } catch (error) {
    console.error("Error searching resources:", error);
    res.status(500).json({ error: "An error occurred while searching resources" });
  }
};


exports.sortResources = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    // Example: Sorting resources by 'createdAt' field in ascending order
    const resources = await resourceModel.find().sort({ createdAt: 1 }).lean();

    return res.status(200).json(resources);
  } catch (error) {
    console.error("Error sorting resources:", error);
    res.status(500).json({ error: "An error occurred while sorting resources" });
  }
};


exports.getResourceCount = async (req, res) => {


  const resourceModel = req.resourceModel;

  try {
    const parsedFields = req.query;

    const aggregationPipeline = [];

    // Check if there are no parsed fields
    if (Object.keys(parsedFields).length === 0) {
      // If no parsed fields, return total count of documents
      const totalCount = await resourceModel.countDocuments();
      return res.status(200).json({ count: totalCount });
    }

    // Iterate through the parsed fields and construct match stages for each field
    Object.entries(parsedFields).forEach(([key, value]) => {
      if (key !== "page" && key !== "limit") {
        // Exclude pagination parameters, add match stage for each parsed field
        const matchStage = { $match: { [key]: value } };
        aggregationPipeline.push(matchStage);
      }
    });

    // Add group stage to count documents
    aggregationPipeline.push({
      $group: {
        _id: null,
        count: { $sum: 1 } // Counting documents
      }
    });

    const countResult = await resourceModel.aggregate(aggregationPipeline);

    // Return the count
    if (countResult.length > 0) {
      return res.status(200).json({ count: countResult[0].count });
    } else {
      return res.status(200).json({ count: 0 }); // If no matching documents found
    }
  } catch (error) {
    console.error("Error counting by parsed fields:", error);
    res.status(500).json({ error: "An error occurred while counting by parsed fields" });
  }
};

// Partial update of resource fields
exports.updateResourceFields = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    const { id } = req.params;
    const { body } = req;

    // Check if the request body contains fields to update
    if (!Object.keys(body).length) {
      return res.status(400).json({ error: "No fields to update provided" });
    }

    const updatedResource = await resourceModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedResource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    return res.status(200).json(updatedResource);
  } catch (error) {
    console.error("Error updating resource fields:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
};


exports.calculateField = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    const { fieldName, method, qFeild, qValue } = req.query;

    let fieldValues

    if (!fieldName || !method) {
      return res.status(400).json({ error: "Please provide fieldName and method" });
    }

    if(qFeild&&qValue){
      fieldValues = await resourceModel.find({[qFeild]:qValue}).select(fieldName).lean();
    }else{
      fieldValues = await resourceModel.find().select(fieldName).lean();
    }

    if (!fieldValues || fieldValues.length === 0) {
      return res.status(404).json({ error: "No resources found" });
    }

    let result;
    switch (method.toLowerCase()) {
      case 'sum':
        result = fieldValues.reduce((acc, obj) => acc + obj[fieldName], 0);
        break;
      case 'average':
        const sum = fieldValues.reduce((acc, obj) => acc + obj[fieldName], 0); 
        result = sum / fieldValues.length;
        break;
      case 'product':
        result = fieldValues.reduce((acc, obj) => acc * obj[fieldName], 1);
        break;
      case 'max':
        result = Math.max(...fieldValues.map(obj => obj[fieldName]));
        break;
      case 'min':
        result = Math.min(...fieldValues.map(obj => obj[fieldName]));
        break;
      case 'count':
        result = fieldValues.length;
        break;
      case 'median':
        const sortedValues = fieldValues.map(obj => obj[fieldName]).sort((a, b) => a - b);
        const mid = Math.floor(sortedValues.length / 2);
        result = sortedValues.length % 2 !== 0 ? sortedValues[mid] : (sortedValues[mid - 1] + sortedValues[mid]) / 2;
        break;
      case 'mode':
        const valueMap = {};
        fieldValues.forEach(obj => {
          const val = obj[fieldName];
          valueMap[val] = (valueMap[val] || 0) + 1;
        });
        const modes = [];
        let maxCount = 0;
        for (const val in valueMap) {
          if (valueMap[val] > maxCount) {
            modes.length = 0;
            modes.push(val);
            maxCount = valueMap[val];
          } else if (valueMap[val] === maxCount) {
            modes.push(val);
          }
        }
        result = modes.length === Object.keys(valueMap).length ? 'No mode' : modes;
        break;
      default:
        return res.status(400).json({ error: "Invalid method provided" });
    }

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error calculating field:", error);
    res.status(500).json({ error: "An error occurred while calculating field" });
  }
};


exports.getFieldOccurrences = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    const { fieldName } = req.query;
    console.log(fieldName);

    if (!fieldName) {
      return res.status(400).json({ error: "Please provide fieldName" });
    }

    const fieldValues = await resourceModel.find().select(fieldName).lean();

    if (!fieldValues || fieldValues.length === 0) {
      return res.status(404).json({ error: "No resources found" });
    }

    const valueMap = {};
    fieldValues.forEach(obj => {
      const val = obj[fieldName];
      valueMap[val] = (valueMap[val] || 0) + 1;
    });

    return res.status(200).json({ occurrences: valueMap });
  } catch (error) {
    console.error("Error finding field occurrences:", error);
    res.status(500).json({ error: error.message });
  }
};



exports.filterByTimeRange = async (req, res) => {
  const resourceModel = req.resourceModel;

  try {
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      console.log(startTime, endTime)
      return res.status(400).json({ error: "Please provide startTime and endTime" });
    }

    const filteredResources = await resourceModel.find({
      createdAt: { $gte: new Date(startTime), $lte: new Date(endTime) }
    }).lean();

    if (!filteredResources || filteredResources.length === 0) {
      return res.status(404).json({ error: "No resources found within the specified time range" });
    }

    return res.status(200).json({count:filteredResources.length,data:filteredResources});
  } catch (error) {
    console.error("Error filtering by time range:", error);
    res.status(500).json({ error: "An error occurred while filtering by time range" });
  }
};





exports.forecast = async (req, res) => {
  try {
    const location = req.query.location;
    const key = process.env.WAPI_KEY;

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${key}&contentType=json`,
      headers: {},
    };

    const response = await axios.request(config);
    const forecastData = response.data;

    res.status(200).json(forecastData);
  } catch (error) {
    console.error("Error:", error);

    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      res.status(500).json({ error: "No response from the server" });
    } else {
      res.status(500).json({ error: "An error occurred" });
    }
  }
};



exports.pay = async (req, res) => {
  try {
      
    const service= req.body
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
              {
                  price_data: {
                      currency: "mwk",
                      product_data: {  
                          name: service.name,
                          images: [service.image],
                      },
                      unit_amount: service.amount * 100,
                  },
                  quantity: 1,
              },
          ],
          mode: "payment",
          success_url: `${process.env.FRONTEND_URL}/payment-success?image=${service.image}&name=${service.name}&farmer=${service.farmer}&product=${service.productId}&amount=${service.amount}&status=6625c2ced8e8138aa1ca8697
          `,
          cancel_url: `${process.env.FRONTEND_URL}/dashboard/farmer/marketplace`,
      });


      

      return res.status(200).json({checkout_url:session.url});

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error occurred", error: e.message });
  }
}


exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(JSON.stringify(req.body), sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
    // ... handle other events
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

const handleCheckoutSessionCompleted = async (session) => {
  const customer = await stripe.customers.retrieve(session.customer);
  const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
  const invoice = await stripe.invoices.retrieve(paymentIntent.invoice);

  // Access invoice and payment details
  console.log('Customer Email:', customer.email);
  console.log('Invoice Amount:', paymentIntent.amount / 100);
  console.log('Invoice Currency:', invoice.currency);
  console.log('Invoice PDF:', invoice.hosted_invoice_url);

  // You can store these details in your database or perform any other required operations
};

exports.login=async (req, res) => {
  const resourceModel = req.resourceModel;
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Find the user in the database by their fullname or email
    const user = await resourceModel.findOne({email: email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {

      const accessToken = jwt.sign(
        user.email,
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(200).json({
        message: "Login successful",
        accessToken: accessToken,
        user: user,
      });

    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
}

exports.register=async (req, res) => {
  const resourceModel = req.resourceModel;
  try {
    if (Array.isArray(req.body)) {
      // Bulk registration for an array of users
      const hashedUsers = [];
      for (const user of req.body) {
        if (!user.password) {
          return res
            .status(400)
            .json({ error: "Password is required for all users" });
        }
        // Generate a salt and hash the user's password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        // Create a new user in the database with the hashed password
        const newUser = await resourceModel.create({
          ...user,
          password: hashedPassword,
        });
        hashedUsers.push(newUser);
      }
      res
        .status(201)
        .json({
          message: "Users registered successfully",
          users: hashedUsers,
        });
    } else {
      // Single user registration
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await resourceModel.create({
        ...req.body,
        password: hashedPassword,
      });
      res.status(201).json({ message: "User registered successfully", user });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user(s)" });
  }
}

exports.getProfile =  async (req, res) => {
  const resourceModel = req.resourceModel;
  const fullname = req.user;
  try {
    const User = await resourceModel.findOne({ fullname: fullname });
    return res.status(200).json(User);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

exports.sendEmail = async (req, res) => {
  try {

    const { subject, recipientEmail, message } = req.body;


    if (!subject || !recipientEmail || !message) {
      return res.status(400).json({ error: "Please provide subject, recipientEmail, and message in the request body" });
    }

    await sendMail(subject, recipientEmail, message);


    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "An error occurred while sending email" });
  }
};


exports.updateProfile = async (req, res) => {
  const resourceModel = req.resourceModel;
  const userId = req.params.id; 

  try {
    const { fullname, email, password, newPassword, ...otherFields } = req.body;

    const updates = {};

    if (fullname) {
      updates.fullname = fullname;
    }

    if (email) {
      updates.email = email;
    }

    // Update password if provided
    if (password && newPassword) {
      // Check if the current password is correct
      const user = await resourceModel.findById(userId);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid current password" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updates.password = hashedPassword;
    }

    // Update other fields if provided
    if (Object.keys(otherFields).length > 0) {
      Object.assign(updates, otherFields);
    }

    // Update the user profile
    const updatedUser = await resourceModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "An error occurred while updating the profile", message: error.message });
  }
};