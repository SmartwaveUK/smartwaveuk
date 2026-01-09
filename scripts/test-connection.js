const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const envConfig = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            const key = match[1];
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            envConfig[key] = value;
        }
    });
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

async function test() {
    console.log('Testing connection to:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
        return;
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );

    console.log('Resolving DNS...');
    // Force IPv4 check if needed, but let's just see default behavior first

    const start = Date.now();
    console.log('Fetching...');
    try {
        // Fetch from public table to force network connection
        const { data, error } = await supabase.from('phones').select('id').limit(1);
        console.log('Time:', Date.now() - start, 'ms');
        if (error) {
            console.error('Supabase Error:', error);
        } else {
            console.log('Success! Data found:', data);
        }
    }
    catch (e) {
        console.error('Exception fetching:', e);
    }
}

test();
