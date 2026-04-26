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
    {name: 'Mullativu', code: 'MUL', provinceName: 'Northern'},
    {name: 'Vavuniya', code: 'VAV', provinceName: 'Northern'},
    {name: 'Batticaloa', code: 'BAT', provinceName: 'Eastern'},
    {name: 'Ampara', code: 'AMP', provinceName: 'Eastern'},
    {name: 'Trincomalee', code: 'TRI', provinceName: 'Eastern'},
    {name: 'Kurunagala', code: 'KUR', provinceName: 'North Western'},
    {name: 'Puttalam', code: 'PUT', provinceName: 'North Western'},
    {name: 'Anuradhapura', code: 'ANU', provinceName: 'North Central'},
    {name: 'Polonaruwa', code: 'POL', provinceName: 'North Central'},
    {name: 'Badulla', code: 'BAD', provinceName: 'Uva'},
    {name: 'Monaragala', code: 'MON', provinceName: 'Uva'},
    {name: 'Ratnapura', code: 'RAT', provinceName: 'Sabaragamuwa'},
    {name: 'Kegalle', code: 'KEG', provinceName: 'Sabaragamuwa'}
];

module.exports = {provinces, districts};