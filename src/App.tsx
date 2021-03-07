import React, { useMemo, useState } from 'react';
import moment from 'moment';

import { getFakeData } from './mockData';
import Table, { ColumnsProp } from './Table';

type CustomersProps = Record<string, string>;



function App() {
    const [customers, setCusomers] = useState<CustomersProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [numOfRecord, setNumberOfRecord] = useState(50);
    const columns = useMemo<ColumnsProp[]>(
        () => [
            { header: 'Id', field: 'id', width: 100 },
            { header: 'First Name', field: 'customerFirstName', width: 100 },
            { header: 'Last Name', field: 'customerLastName', width: 100 },
            { header: 'Middle', field: 'customerMiddletName', width: 80 },
            { header: 'Phone', field: 'customerPhone', width: 150 },
            { header: 'Gender', field: 'customerGender', width: 80 },
            {
                header: 'BirthDay',
                field: 'customerBirthday',
                Cell: ({ cellValue }) => {
                    return <span>{moment(cellValue).format('MM/DD/YY')}</span>;
                },
                width: 100,
            },
            { header: 'Job Type', field: 'customerJob', width: 150 },
            { header: 'Level', field: 'customerLevel', width: 150 },
            { header: 'State', field: 'state', width: 100 },
            { header: 'Country', field: 'country', width: 200 },
            { header: 'Oders', field: 'numberOfOrders', width: 100 },
            {
                header: 'Registered Date',
                field: 'registeredDate',
                Cell: ({ cellValue }) => {
                    return <span>{moment(cellValue).format('MM/DD/YY')}</span>;
                },
                width: 150,
            },
            { header: 'Weight', field: 'weight', width: 50 },
            { header: 'Notes', field: 'notes' },
        ],
        [],
    );

    const fetchData = () =>
        new Promise<CustomersProps[]>((resolve) => {
            setTimeout(() => resolve(getFakeData(numOfRecord)), 0);
        });

    const handleLoadData = async () => {
        setLoading(true);
        const customers = await fetchData();
        setLoading(false);
        setCusomers(customers);
    };

    return (
        <div className={loading ? 'loading' : ''} style={{ margin: '24px' }}>
            <div style={{ marginBottom: '14px' }}>
                <button disabled={loading} onClick={handleLoadData}>
                    Load Data
                </button>
                <input value={numOfRecord} type="number" onChange={(event) => setNumberOfRecord(+event.target.value)} max="1000000"/>
                {loading && <span>Loading</span>}
            </div>
            <Table data={customers} rowHeight={20} rowBuffer={5} columns={columns} tableHeight={500} paddingTop={20} />
        </div>
    );
}

export default App;
