import faker from 'faker';

let data: any[];

export const getFakeData = (number = 1000000) => {
    // if(data) return data;
    data = Array(number)
        .fill('')
        .map((item, index) => ({
            id: index + 1,
            customerFirstName: faker.name.firstName(),
            customerLastName: faker.name.lastName(),
            customerMiddletName: faker.name.middleName(),
            customerPhone: faker.phone.phoneNumber('+##.###.###.###'),
            customerGender: ['Male', 'Female'][faker.random.number(1)],
            customerBirthday: faker.date.between(1950, '01/01/2000'),
            registeredDate: faker.date.between(2010, '01/01/2020'),
            customerJob: faker.name.jobType(),
            state: faker.address.stateAbbr(),
            country: faker.address.country(),
            customerLevel: ['VIP', 'New', 'Royal'][faker.random.number(2)],
            numberOfOrders: faker.random.number(10),
            weight: faker.random.number({min:50,max:200}),
            notes: faker.random.words(1),
        }));
    return data;
};
