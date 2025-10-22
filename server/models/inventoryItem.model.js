import mongoose from 'mongoose';
import { trim } from 'validator';
//physical resources
const inventoryItemSchema = new mongoose.Schema({
    //link back to the providing ngo(foreign key referenece)
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
    //type of resource(food,clothes,shelter,medical supplies etc)
    itemType: { type: String, required: true,trim: true ,uppercase:true,},

    //current quantity available
    quantity: { type: Number, required: true, min: 0 },

    //date/time of the last successful update
    lastUpdated: { type: Date, default: Date.now },

    //optional description or notes about the item
    description: { type: String, trim: true }
});

//enforce that ngo cannot have duplicate item types in inventory
inventoryItemSchema.index({ ngo: 1, itemType: 1 }, { unique: true });

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema); 
export default InventoryItem;