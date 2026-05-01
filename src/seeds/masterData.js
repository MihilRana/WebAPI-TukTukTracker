const provinces = [
    {name: 'Western', code: 'WP'},
    {name: 'Central', code: 'CP'},
    {name: 'Southern', code: 'SP'},
    {name: 'Northern', code: 'NP'},
    {name: 'Eastern', code: 'EP'},
    {name: 'North Western', code: 'NWP'},
    {name: 'North Central', code: 'NCP'},
    {name: 'Uva', code: 'UP'},
    {name: 'Sabaragamuwa', code: 'SGP'}
];

const districts = [
    {name: 'Colombo', code: 'CMB', provinceName: 'Western'},
    {name: 'Gampaha', code: 'GAM', provinceName: 'Western'},
    {name: 'Kalutara', code: 'KAL', provinceName: 'Western'},
    {name: 'Kandy', code: 'KAN', provinceName: 'Central'},
    {name: 'Matale', code: 'MAT', provinceName: 'Central'},
    {name: 'Nuwara Eliya', code: 'NUE', provinceName: 'Central'},
    {name: 'Galle', code: 'GAL', provinceName: 'Southern'},
    {name: 'Matara', code: 'MTR', provinceName: 'Southern'},
    {name: 'Hambantota', code: 'HBT', provinceName: 'Southern'},
    {name: 'Jaffna', code: 'JAF', provinceName: 'Northern'},
    {name: 'Kilinochchi', code: 'KIL', provinceName: 'Northern'},
    {name: 'Mannar', code: 'MAN', provinceName: 'Northern'},
    {name: 'Mullaitivu', code: 'MUL', provinceName: 'Northern'},
    {name: 'Vavuniya', code: 'VAV', provinceName: 'Northern'},
    {name: 'Batticaloa', code: 'BAT', provinceName: 'Eastern'},
    {name: 'Ampara', code: 'AMP', provinceName: 'Eastern'},
    {name: 'Trincomalee', code: 'TRI', provinceName: 'Eastern'},
    {name: 'Kurunegala', code: 'KUR', provinceName: 'North Western'},
    {name: 'Puttalam', code: 'PUT', provinceName: 'North Western'},
    {name: 'Anuradhapura', code: 'ANU', provinceName: 'North Central'},
    {name: 'Polonnaruwa', code: 'POL', provinceName: 'North Central'},
    {name: 'Badulla', code: 'BAD', provinceName: 'Uva'},
    {name: 'Monaragala', code: 'MON', provinceName: 'Uva'},
    {name: 'Ratnapura', code: 'RAT', provinceName: 'Sabaragamuwa'},
    {name: 'Kegalle', code: 'KEG', provinceName: 'Sabaragamuwa'}
];

const policeStations = [
    { name: 'Colombo Fort Police Station', districtName: 'Colombo', contactNumber: '011-2421111', address: 'Fort, Colombo 01' },
    { name: 'Pettah Police Station', districtName: 'Colombo', contactNumber: '011-2422222', address: 'Pettah, Colombo 11' },
    { name: 'Bambalapitiya Police Station', districtName: 'Colombo', contactNumber: '011-2583333', address: 'Bambalapitiya, Colombo 04' },
    { name: 'Nugegoda Police Station', districtName: 'Colombo', contactNumber: '011-2814444', address: 'Nugegoda' },
    { name: 'Negombo Police Station', districtName: 'Gampaha', contactNumber: '031-2225555', address: 'Negombo' },
    { name: 'Gampaha Police Station', districtName: 'Gampaha', contactNumber: '033-2226666', address: 'Gampaha' },
    { name: 'Kalutara North Police Station', districtName: 'Kalutara', contactNumber: '034-2227777', address: 'Kalutara North' },
    { name: 'Kandy Police Station', districtName: 'Kandy', contactNumber: '081-2228888', address: 'Kandy' },
    { name: 'Peradeniya Police Station', districtName: 'Kandy', contactNumber: '081-2389999', address: 'Peradeniya' },
    { name: 'Matale Police Station', districtName: 'Matale', contactNumber: '066-2220000', address: 'Matale' },
    { name: 'Nuwara Eliya Police Station', districtName: 'Nuwara Eliya', contactNumber: '052-2221111', address: 'Nuwara Eliya' },
    { name: 'Galle Police Station', districtName: 'Galle', contactNumber: '091-2222222', address: 'Galle' },
    { name: 'Matara Police Station', districtName: 'Matara', contactNumber: '041-2223333', address: 'Matara' },
    { name: 'Jaffna Police Station', districtName: 'Jaffna', contactNumber: '021-2224444', address: 'Jaffna' },
    { name: 'Batticaloa Police Station', districtName: 'Batticaloa', contactNumber: '065-2225555', address: 'Batticaloa' },
    { name: 'Trincomalee Police Station', districtName: 'Trincomalee', contactNumber: '026-2226666', address: 'Trincomalee' },
    { name: 'Kurunegala Police Station', districtName: 'Kurunegala', contactNumber: '037-2227777', address: 'Kurunegala' },
    { name: 'Anuradhapura Police Station', districtName: 'Anuradhapura', contactNumber: '025-2228888', address: 'Anuradhapura' },
    { name: 'Badulla Police Station', districtName: 'Badulla', contactNumber: '055-2229999', address: 'Badulla' },
    { name: 'Ratnapura Police Station', districtName: 'Ratnapura', contactNumber: '045-2220000', address: 'Ratnapura' },
    { name: 'Hambantota Police Station', districtName: 'Hambantota', contactNumber: '047-2221111', address: 'Hambantota' },
    { name: 'Kegalle Police Station', districtName: 'Kegalle', contactNumber: '035-2222222', address: 'Kegalle' }
];

const firstNames = [
    'Kamal', 'Nimal', 'Sunil', 'Amal', 'Saman', 'Ruwan', 'Chaminda', 'Pradeep',
    'Lakshan', 'Dinesh', 'Nuwan', 'Kasun', 'Sampath', 'Roshan', 'Tharanga',
    'Mahesh', 'Janaka', 'Asanka', 'Chathura', 'Buddhika', 'Lasantha', 'Indika',
    'Ravindra', 'Thilina', 'Sajith', 'Kumara', 'Ajith', 'Prasanna', 'Sandun',
    'Dilshan', 'Thisara', 'Lahiru', 'Malinga', 'Herath', 'Dasun', 'Pathum',
    'Kusal', 'Dhananjaya', 'Wanindu', 'Charith'
];

const lastNames = [
    'Perera', 'Silva', 'Fernando', 'Jayawardena', 'Bandara', 'Dissanayake',
    'Wijesinghe', 'Rathnayake', 'Gunasekara', 'Herath', 'Samarasinghe',
    'Wickramasinghe', 'Rajapaksa', 'Senaratne', 'Amarasinghe', 'Karunaratne',
    'Gunawardena', 'Kumarasinghe', 'Ekanayake', 'Pathirana', 'Mendis',
    'Liyanage', 'Weerasinghe', 'Thilakarathne', 'Ranasinghe'
];

const vehicleMakes = [
    { make: 'Bajaj', model: 'RE Compact', years: [2018, 2019, 2020, 2021, 2022, 2023] },
    { make: 'Bajaj', model: 'RE 4S', years: [2017, 2018, 2019, 2020, 2021] },
    { make: 'Piaggio', model: 'Ape City', years: [2019, 2020, 2021, 2022] },
    { make: 'TVS', model: 'King', years: [2018, 2019, 2020, 2021, 2022] },
    { make: 'Bajaj', model: 'Maxima Z', years: [2020, 2021, 2022, 2023] }
];

const colors = ['White', 'Red', 'Yellow', 'Blue', 'Green', 'Black', 'Maroon'];

module.exports = {provinces, districts, policeStations, firstNames, lastNames, vehicleMakes, colors};
