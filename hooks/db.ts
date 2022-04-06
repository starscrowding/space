import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add Mongo URI');
}

export const client = mongoose.connect(uri);

export const toJSON = (data: any = '') => {
  return JSON.parse(JSON.stringify(data));
};

const StarsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    index: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  ipfs: {
    type: String,
    required: true,
  },
});
StarsSchema.index({name: 'text'});

export const Stars = mongoose.models.Stars || mongoose.model('Stars', StarsSchema);
