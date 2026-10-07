import { raceStore } from '../../../../lib/arithmetic-race-store';

// Discovery only: participant data and host credentials are never returned here.
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('room') ?? '';
  if (!/^\d{4}$|^\d{6}$/.test(code)) return new Response(null, { status: 400 });
  const race = await (await raceStore()).race(code);
  return new Response(null, { status: !race ? 404 : race.status === 'waiting' ? 204 : 409,
    headers: { 'Cache-Control': 'no-store' } });
}
