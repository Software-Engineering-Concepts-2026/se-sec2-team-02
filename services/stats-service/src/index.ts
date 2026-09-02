import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

export interface JobStats {
  averageHourlyRate: number;
  totalActiveListings: number;
  topCategories: { category: string; count: number }[];
  popularLocations: { location: string; count: number }[];
}

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'stats-service',
    runtime: 'TypeScript/Node.js',
    timestamp: new Date().toISOString()
  });
});

// Calculate and return stats for University of Phayao jobs
app.get('/api/stats', (_req: Request, res: Response) => {
  const stats: JobStats = {
    averageHourlyRate: 48.5,
    totalActiveListings: 8,
    topCategories: [
      { category: 'cafe-restaurant', count: 2 },
      { category: 'general', count: 3 },
      { category: 'delivery', count: 1 },
      { category: 'tutor', count: 1 },
      { category: 'admin-academic', count: 1 }
    ],
    popularLocations: [
      { location: 'หน้ามหาวิทยาลัยพะเยา', count: 4 },
      { location: 'รอบวิทยาเขต ม.พะเยา', count: 2 },
      { location: 'อาคารสงวนเสริมศรี', count: 1 },
      { location: 'ตึกคณะ ICT', count: 1 }
    ]
  };

  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Stats Service (TypeScript) running on http://localhost:${PORT}`);
});
