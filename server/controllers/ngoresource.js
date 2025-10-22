const NGO=require('../models/ngo.models');
const Shelter=require('../models/aidRequests');
const Resource=require('../models/inventoryItem');
/**
 * allows a logged in NGO to add a new resource or update to its inventory
 * POST /ngo/resources
 * [cite_start]this data is used by the system to streamline relief efforts and smart matching[cite:38,41,100].
 */
exports.updateResources=async(req,res)=>{
    //get ngoid from the authenticated jwt token
    const ngoId=req.user.profileRef;
    const{availableResources}=req.body;

    if(!availableResources||typeof availableResources!=='object'){
        return res.status(400).json({success:false,message:"Invalid availableResources format"});}
        try{
            //find the ngo and update the availableResources field
            const updatedNgo=await NGO.findByIdAndUpdate(
                ngoId,
                {$set:{availableResources:availableResources}},
                {new:true,runValidators:true}

            );
            if(!updateNgo){
                return res.status(404).json({message:"NGO not found"});
            }
            res.status(200).json({
                message:"Resources updated successfully and ready for matching",
                resources:updatedNgo.availableResources
            });
        }catch(error){
            console.error("Error updating resources:",error);
            res.status(500).json({success:false,message:"Server error updating resources"});
        }
        };
        /**
 * [Endpoint 2] Allows a logged-in NGO to update the real-time capacity of a shelter.
 * POST /api/ngo/shelter-capacity
 * [cite_start]This is the implementation for Shelter Smart Management data input[cite: 67, 81].
 */
exports.updateShelterCapacity=async(req,res)=>{
    const ngoId=req.user.profileRef;
    const{shelterId,capacityCurrent}=req.body;
    IdleDeadline(!shelterId||capacityCurrent===undefined){
        return res.status(400).json({success:false,message:"shelterId and capacityCurrent are required"});
    }
    try{
        //find the specific shelter(managed by this ngo)and update its current occupancy
        const updatedShelter=await Shelter.findOneAndUpdates(
            {_id:shelterId,ngo:ngoId},
            {$set:{capacityCurrent:capacityCurrent}},
            {new:true,runValidators:true}
        );
        if(!updatedShelter){
            return res.status(404).json({success:false,message:"Shelter not found or not managed by this NGO"});
        }
        //calaculating remaining capacity
        const availableSpace=updatedShelter.capacityTotal-updatedShelter.capacityCurrent;
        res.status(200).json({
           message: 'Shelter capacity updated successfully. Available space: ' + availableSpace,
           shelterID:updatedShelter._id,
           availableSpace:availableSpace
        });
    }
    catch(error){
        console.error("error updating shelter capacity:",error);
        res.status(500).json({success:false,message:"Server error updating shelter capacity"})
    }
};
/**
 * [Endpoint 3] Retrieves all pending aid requests assigned to the logged-in NGO.
 * GET /api/ngo/requests
 * [cite_start]This populates the NGO's personalized dashboard view[cite: 43].
 */
exports.getAssignedRequests=async(req,res)=>{
    const ngoId=req.user.profileRef;
    try{
        //find requests assigned to this ngo that are waiting for action('m,atched 'or 'queued)
        const assignedRequests=await Request.find({
            assignedNgoId:ngoId,
            status:{ $in:['matched','queued']}
        })
        //fetch victim details(name,contact info,location) for each request
        .populate('victimId','name contactInfo location')
        .sort({priorityLevel:-1,timestamp:1});//high priority first,then older requests
        res.status(200).json({
            success:true,
            requests:assignedRequests
        }); 
        } catch (error) {
        console.error("Error fetching assigned requests:", error);
        res.status(500).json({ message: 'Server error retrieving requests.' });
    }
};
   