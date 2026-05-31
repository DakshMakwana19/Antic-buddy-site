import { NextResponse } from 'next/server';
import { connectDB, ActivityLogModel } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const logs = await ActivityLogModel.find({}).sort({ timestamp: -1 }).limit(1000).lean();
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const log = await req.json();
    await ActivityLogModel.create(log);
    
    // Optional: Keep only 1000 latest to match previous behavior
    // For large collections, a capped collection is better, but this works for now.
    const count = await ActivityLogModel.countDocuments({});
    if (count > 1000) {
      const oldestLogs = await ActivityLogModel.find({}).sort({ timestamp: 1 }).limit(count - 1000);
      const idsToDelete = oldestLogs.map(l => l._id);
      await ActivityLogModel.deleteMany({ _id: { $in: idsToDelete } });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
