import User from "../models/user.model.js";
import StudentWorks from "../models/studentWorks.model.js";
import cloudinary from 'cloudinary';
export const createStudentWorks = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "Unauthorized user" });
        }

        const { tabs } = req.body;
        if (!Array.isArray(tabs) || tabs.length === 0) {
            return res.status(400).json({ error: "Tabs must be a non-empty array" });
        }

        // If no data exists, create a new one -> Refering to DB
        let studentWorksDoc = await StudentWorks.findOne({ user: userId });
        if (!studentWorksDoc) {
            studentWorksDoc = new StudentWorks({ user: userId, tabs: [] });
        }

        //Referring to tabs
        for (const newTab of tabs) {
            // 🔹 Upload images inside studentWorksDetails
            for (const work of newTab.studentWorksDetails) {
                if (work.image) {
                    const uploadResponse = await cloudinary.uploader.upload(work.image, {
                        folder: "student-works"
                    });
                    work.image = uploadResponse.secure_url;
                }
            }
            // Check if a tab with same tabHeading and studentWorksHeading exists
            const existingTab = studentWorksDoc.tabs.find(tab =>
                tab.tabHeading === newTab.tabHeading &&
                tab.studentWorksHeading === newTab.studentWorksHeading
            );
            if (existingTab) {
                // Merge new studentWorksDetails into existing tab
                existingTab.studentWorksDetails.push(...newTab.studentWorksDetails);
            } else {
                // Add as a new tab
                studentWorksDoc.tabs.push(newTab);
            }
        }
        await studentWorksDoc.save();
        return res.status(201).json({
            message: "Student works added/updated successfully",
            data: studentWorksDoc
        });
    } catch (error) {
        console.error("Error in createOrUpdateStudentWorks:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllStudentWorks = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "Unauthorized user" });
        }

        const studentWorks = await StudentWorks.find();
        return res.status(200).json({ datas: studentWorks });
    } catch (error) {
        console.error("Error in getAllStudentWorks:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteStudentWorks = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "Unauthorized user" });
        }

        const workIdToDelete = req.params.id;
        if (!workIdToDelete) {
            return res.status(400).json({ error: "studentWorksDetailsId is not found" });
        }
        console.log("studentWorksDetailsIdTodelete:", workIdToDelete)
        const studentWorksDetails = await StudentWorks.find();
        console.log("student work details: ", studentWorksDetails);
        
        if (!studentWorksDetails) {
            return res.status(404).json({ error: "Student works not found" });
        }

        const studentWorksDoc = studentWorksDetails[0]; // first document

        studentWorksDoc.tabs.forEach(tab => {
            tab.studentWorksDetails = tab.studentWorksDetails.filter(
                sw => sw._id.toString() !== workIdToDelete
            );
        });

        console.log("studentWorksDoc", studentWorksDoc);
        // Save the updated document
        await studentWorksDoc.save();

        return res.status(200).json({ message: "Student works deleted successfully" }); 
    } catch (error) {
        console.error("Error in deleteStudentWorks:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateStudentWorks = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ error: "Unauthorized user" });
    }

    const { image, title, description } = req.body;
    const idToUpdateStudentWorks = req.params.id;

    if (!idToUpdateStudentWorks) {
      return res.status(400).json({ error: "ID to update student works is missing" });
    }

    // Get document
    const studentWorksDoc = await StudentWorks.findOne();
    if (!studentWorksDoc) {
      return res.status(404).json({ error: "Student works not found" });
    }

    let workToUpdate = null;

    // Find the nested work
    for (const tab of studentWorksDoc.tabs) {
      workToUpdate = tab.studentWorksDetails.id(idToUpdateStudentWorks);
      if (workToUpdate) break;
    }

    if (!workToUpdate) {
      return res.status(404).json({ error: "Student work not found" });
    }

    // Update fields
    workToUpdate.title = title ?? workToUpdate.title;
    workToUpdate.description = description ?? workToUpdate.description;

    // Image upload (optional)
    if (image) {
      // delete old image if needed
      if (workToUpdate.image) {
        const publicId = workToUpdate.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "student-works",
      });

      workToUpdate.image = uploadResponse.secure_url;
    }

    // Save parent document
    await studentWorksDoc.save();

    return res.status(200).json({
      message: "Student work updated successfully",
      data: workToUpdate,
    });

  } catch (error) {
    console.error("Error in updateStudentWorks:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
