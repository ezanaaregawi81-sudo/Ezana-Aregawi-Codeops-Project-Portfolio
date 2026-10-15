import { getAllDishes } from '@/lib/dishes';

export async function GET() {
  return Response.json(getAllDishes());
}
