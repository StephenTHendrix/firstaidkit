import fs from 'fs';

import type { ApplicantDisplay } from './pages/api/lib/applicant'
import { getDB } from './pages/api/lib/db';

const DUMMY_APPLICANTS: ApplicantDisplay[] = [
    {
        name: 'Alice',
        phone: '1115551111',
        screener: 'approved'
    },
    {
        name: 'Bob',
        phone: '2225552222',
        screener: 'pending'
    },
    {
        name: 'Carol',
        phone: '3335553333',
        screener: 'rejected'
    },
    {
        name: 'Dave',
        phone: '4445554444',
        screener: 'approved'
    },
    {
        name: 'Elea',
        phone: '5555555555',
        screener: 'pending'
    },
    {
        name: 'Frank',
        phone: '6665556666',
        screener: 'rejected'
    },
    {
        name: 'Gertrude',
        phone: '7775557777',
        screener: 'approved'
    },
    {
        name: 'Harry',
        phone: '8885558888',
        screener: 'pending'
    },
    {
        name: 'Ingrid',
        phone: '9995559999',
        screener: 'rejected'
    },
    {
        name: 'John',
        phone: '0005550000',
        screener: 'approved'
    }
];

(async () => {
    // Wipe and reset the DB
    try {
        fs.unlinkSync('database.db');
    } catch (e) {
        // Probably didn't exist yet
    }
    const db = await getDB();
    await db.exec(`
        create table applicant (
            id integer primary key autoincrement,
            name text,
            phone text,
            screener text check(screener in ('pending', 'approved', 'rejected'))
        ); 
    `);
    
    for (const applicant of DUMMY_APPLICANTS) {
        await db.run('insert into applicant (name, phone, screener) values (?, ?, ?)', 
            applicant.name,
            applicant.phone,
            applicant.screener);
    }
})();
