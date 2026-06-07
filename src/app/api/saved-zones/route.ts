import { NextRequest, NextResponse } from 'next/server';
import { KidsZone } from '../../types';

export const dynamic = 'force-dynamic';

interface SavedZoneRow {
  device_id: string;
  zone_key: string;
  zone_data: KidsZone;
  created_at: string;
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase environment variables are missing');
  }

  return {
    url: url.replace(/\/$/, ''),
    serviceRoleKey,
  };
}

function getSupabaseHeaders(serviceRoleKey: string, prefer?: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

function getZoneKey(zone: KidsZone) {
  return `${zone.name}|${zone.address}`;
}

function getDeviceId(request: NextRequest) {
  return request.nextUrl.searchParams.get('deviceId')?.trim() || null;
}

function createConfigErrorResponse() {
  return NextResponse.json(
    {
      zones: [],
      error: 'Supabase 환경 변수가 설정되지 않았습니다.',
    },
    { status: 503 }
  );
}

export async function GET(request: NextRequest) {
  const deviceId = getDeviceId(request);

  if (!deviceId) {
    return NextResponse.json({ zones: [] });
  }

  try {
    const { url, serviceRoleKey } = getSupabaseConfig();
    const params = new URLSearchParams({
      select: 'zone_data,created_at',
      device_id: `eq.${deviceId}`,
      order: 'created_at.desc',
    });
    const response = await fetch(`${url}/rest/v1/saved_zones?${params}`, {
      headers: getSupabaseHeaders(serviceRoleKey),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Supabase saved zones fetch failed with ${response.status}`);
    }

    const rows = (await response.json()) as Array<Pick<SavedZoneRow, 'zone_data' | 'created_at'>>;
    return NextResponse.json({ zones: rows.map((row) => row.zone_data) });
  } catch (error) {
    if (error instanceof Error && error.message.includes('environment variables')) {
      return createConfigErrorResponse();
    }

    return NextResponse.json({ zones: [], error: '저장된 항목을 불러오지 못했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { deviceId?: string; zone?: KidsZone };
    const deviceId = body.deviceId?.trim();
    const zone = body.zone;

    if (!deviceId || !zone) {
      return NextResponse.json({ error: 'deviceId와 zone이 필요합니다.' }, { status: 400 });
    }

    const { url, serviceRoleKey } = getSupabaseConfig();
    const row: Omit<SavedZoneRow, 'created_at'> = {
      device_id: deviceId,
      zone_key: getZoneKey(zone),
      zone_data: zone,
    };
    const params = new URLSearchParams({
      on_conflict: 'device_id,zone_key',
    });
    const response = await fetch(`${url}/rest/v1/saved_zones?${params}`, {
      method: 'POST',
      headers: getSupabaseHeaders(serviceRoleKey, 'resolution=merge-duplicates,return=minimal'),
      body: JSON.stringify(row),
    });

    if (!response.ok) {
      throw new Error(`Supabase saved zones insert failed with ${response.status}`);
    }

    return NextResponse.json({ zone });
  } catch (error) {
    if (error instanceof Error && error.message.includes('environment variables')) {
      return createConfigErrorResponse();
    }

    return NextResponse.json({ error: '항목을 저장하지 못했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const deviceId = getDeviceId(request);
  const zoneKey = request.nextUrl.searchParams.get('zoneKey')?.trim();

  if (!deviceId || !zoneKey) {
    return NextResponse.json({ error: 'deviceId와 zoneKey가 필요합니다.' }, { status: 400 });
  }

  try {
    const { url, serviceRoleKey } = getSupabaseConfig();
    const params = new URLSearchParams({
      device_id: `eq.${deviceId}`,
      zone_key: `eq.${zoneKey}`,
    });
    const response = await fetch(`${url}/rest/v1/saved_zones?${params}`, {
      method: 'DELETE',
      headers: getSupabaseHeaders(serviceRoleKey),
    });

    if (!response.ok) {
      throw new Error(`Supabase saved zones delete failed with ${response.status}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('environment variables')) {
      return createConfigErrorResponse();
    }

    return NextResponse.json({ error: '저장된 항목을 삭제하지 못했습니다.' }, { status: 500 });
  }
}
