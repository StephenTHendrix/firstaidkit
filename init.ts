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
    },
    {
        name: 'Katherine',
        phone: '1115550000',
        screener: 'pending'
    },
    {
        name: 'Liam',
        phone: '2225551111',
        screener: 'approved'
    },
    {
        name: 'Mona',
        phone: '3335552222',
        screener: 'pending'
    },
    {
        name: 'Nathan',
        phone: '4445553333',
        screener: 'pending'
    },
    {
        name: 'Olivia',
        phone: '5555554444',
        screener: 'approved'
    },
    {
        name: 'Paul',
        phone: '6665555555',
        screener: 'pending'
    },
    {
        name: 'Quincy',
        phone: '7775556666',
        screener: 'pending'
    },
    {
        name: 'Rachel',
        phone: '8885557777',
        screener: 'approved'
    },
    {
        name: 'Steve',
        phone: '9995558888',
        screener: 'rejected'
    },
    {
        name: 'Tracy',
        phone: '0005559999',
        screener: 'pending'
    },
    {
        name: 'Uma',
        phone: '1115558888',
        screener: 'approved'
    },
    {
        name: 'Victor',
        phone: '2225559999',
        screener: 'rejected'
    },
    {
        name: 'Wendy',
        phone: '3335550000',
        screener: 'pending'
    },
    {
        name: 'Xander',
        phone: '4445551111',
        screener: 'approved'
    },
    {
        name: 'Yvonne',
        phone: '5555552222',
        screener: 'rejected'
    },
    {
        name: 'Zach',
        phone: '6665553333',
        screener: 'approved'
    },
    {
        name: 'Alan',
        phone: '7775554444',
        screener: 'pending'
    },
    {
        name: 'Betty',
        phone: '8885555555',
        screener: 'rejected'
    },
    {
        name: 'Charles',
        phone: '9995556666',
        screener: 'approved'
    },
    {
        name: 'Diana',
        phone: '0005557777',
        screener: 'pending'
    },
    {
        name: 'Edward',
        phone: '1115556666',
        screener: 'rejected'
    },
    {
        name: 'Fiona',
        phone: '2225554444',
        screener: 'approved'
    },
    {
        name: 'George',
        phone: '3335555555',
        screener: 'pending'
    },
    {
        name: 'Hannah',
        phone: '4445556666',
        screener: 'rejected'
    },
    {
        name: 'Isabel',
        phone: '5555557777',
        screener: 'approved'
    },
    {
        name: 'Jack',
        phone: '6665558888',
        screener: 'pending'
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
