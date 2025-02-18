export const dummyUsers = [
    {
        userName: "Rajesh Kumar",
        email: "rajesh.kumar@gmail.com",
        password: "Password123!",
    },
    {
        userName: "Priya Sharma",
        email: "priya.sharma@gmail.com",
        password: "Password123!",
    },
    {
        userName: "Abdul Rahman",
        email: "abdul.rahman@gmail.com",
        password: "Password123!",
    },
    {
        userName: "Mary Thomas",
        email: "mary.thomas@gmail.com",
        password: "Password123!",
    }
];

export const dummyProperties = [
    {
        title: "Peaceful Hindu Family Villa",
        description: "Traditional Hindu villa near famous Iskon temple. Perfect for vegetarian families seeking spiritual environment.",
        price: 15000,
        location: {
            address: "15, Temple Road, Malleshwaram",
            city: "Bangalore",
            state: "Karnataka",
            country: "India",
            zipCode: "560003"
        },
        images: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
            "https://images.unsplash.com/photo-1576941089067-2de3c901e126"
        ],
        amenities: ["WiFi", "Temple View", "Air Conditioning", "Satvik Kitchen", "Puja Room", "Garden"],
        specifications: {
            bedrooms: 3,
            bathrooms: 2,
            area: 1800,
            furnished: true,
            floor: "2nd Floor",
            totalFloors: 4,
            ageOfProperty: 5,
            powerBackup: true,
            waterSupply: "24x7"
        },
        maintenanceCharges: {
            amount: 2000,
            frequency: "monthly"
        },
        securityDeposit: 30000,
        ownerDetails:{
            name:"Abimanyu",
            email:"abimanyu@gmail.com",
            phone:"+91 8879087767"
        },
        preferredTenants: ["family", "working professionals"],
        minLeaseDuration: 12,
        status: "available",
        petsAllowed: false,
        foodPreference: "vegetarian",
        religionPreference: "hindu",
        rules: [
            "Strictly vegetarian kitchen",
            "No non-veg food allowed",
            "Shoes off inside",
            "No smoking/alcohol",
            "Maintain silence during morning/evening aarti"
        ],
        parking: {
            bikeParking: {
                available: true,
                covered: true,
                charges: 0
            },
            carParking: {
                available: true,
                covered: true,
                charges: 1000
            }
        }
    },
    {
        title: "Muslim Family Apartment",
        description: "Modern apartment near Jama Masjid with dedicated prayer space and halal kitchen.",
        price: 12000,
        location: {
            address: "45, Mosque Street, Shivajinagar",
            city: "Bangalore",
            state: "Karnataka",
            country: "India",
            zipCode: "560001"
        },
        images: [
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
        ],
        amenities: ["WiFi", "Namaz Room", "Mosque View", "Halal Kitchen", "Parking"],
        specifications: {
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            furnished: true
        },
        ownerDetails:{
            name:"Abdul Rahman",
            email:"rahman@gmail.com",
            phone:"+91 7879097867"
        },
        status: "available",
        petsAllowed: false,
        foodPreference: "non-vegetarian",
        religionPreference: "muslim",
        rules: [
            "Halal food only",
            "No alcohol",
            "Prayer room available",
            "Respect prayer times",
            "Separate sections for family"
        ],
        parking: {
            bikeParking: {
                available: true,
                covered: false,
                charges: 200
            },
            carParking: {
                available: true,
                covered: false,
                charges: 800
            }
        }
    },
    {
        title: "Christian Home Stay",
        description: "Peaceful home near St. Mary's Church, perfect for Christian families.",
        price: 13000,
        location: {
            address: "28, Church Street",
            city: "Kochi",
            state: "Kerala",
            country: "India",
            zipCode: "682011"
        },
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
        ],
        amenities: ["WiFi", "Church View", "Garden", "Prayer Room", "Modern Kitchen"],
        specifications: {
            bedrooms: 3,
            bathrooms: 2,
            area: 1500,
            furnished: true
        },
        status: "available",
        petsAllowed: true,
        ownerDetails:{
            name:"John",
            email:"john@gmail.com",
            phone:"+91 9809059767"
        },
        foodPreference: "non-vegetarian",
        religionPreference: "christian",
        rules: [
            "Respect Sunday mass timings",
            "Family-friendly environment",
            "Quiet hours during prayer times",
            "Keep premises clean",
            "No loud music after 10 PM"
        ],
        parking: {
            bikeParking: {
                available: true,
                covered: true,
                charges: 0
            },
            carParking: {
                available: false,
                covered: false,
                charges: 0
            }
        }
    },
    {
        title: "Modern Multi-Cultural Apartment",
        description: "Contemporary apartment in cosmopolitan area welcoming all communities.",
        price: 18000,
        location: {
            address: "42, Harmony Road, HSR Layout",
            city: "Bangalore",
            state: "Karnataka",
            country: "India",
            zipCode: "560102"
        },
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
        ],
        amenities: ["WiFi", "Gym", "Swimming Pool", "Multi-faith Prayer Room", "Dual Kitchen"],
        specifications: {
            bedrooms: 3,
            bathrooms: 3,
            area: 2000,
            furnished: true
        },
        ownerDetails:{
            name:"Rahuvaran",
            email:"rahuvaran@gmail.com",
            phone:"+91 6877897860"
        },
        status: "available",
        petsAllowed: true,
        foodPreference: "non-vegetarian",
        religionPreference: "any-religion",
        rules: [
            "Respect all faiths",
            "Separate kitchens for veg/non-veg",
            "Pets allowed with deposit",
            "No loud noises during prayer times",
            "Community events welcome"
        ],
        parking: {
            bikeParking: {
                available: true,
                covered: true,
                charges: 300
            },
            carParking: {
                available: true,
                covered: true,
                charges: 1500
            }
        }
    }
];

export const dummyBookings = [
    {
        moveInDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        leaseDuration: 12,
        monthlyRent: 15000,
        securityDeposit: 30000,
        status: "pending",
        tenantDetails: {
            occupation: "Software Engineer",
            workplace: "Infosys",
            familySize: 3,
            idProof: "AADHAAR",
            alternateMobile: "+91-9876543213"
        },
        agreementDetails: {
            startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            endDate: new Date(Date.now() + (30 + 365) * 24 * 60 * 60 * 1000), // 1 year + 30 days from now
            isRegistered: false
        },
        utilityIncluded: {
            electricity: false,
            water: true,
            maintenance: true
        },
        specialRequests: "Need to install modular kitchen",
        contactNumber: "+91-9876543210"
    },
    {
        moveInDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        leaseDuration: 24,
        monthlyRent: 12000,
        securityDeposit: 24000,
        status: "approved",
        tenantDetails: {
            occupation: "Teacher",
            workplace: "Delhi Public School",
            familySize: 2,
            idProof: "PAN",
            alternateMobile: "+91-9876543214"
        },
        agreementDetails: {
            startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
            endDate: new Date(Date.now() + (60 + 730) * 24 * 60 * 60 * 1000), // 2 years + 60 days from now
            isRegistered: true,
            registrationNumber: "REG123456"
        },
        utilityIncluded: {
            electricity: false,
            water: false,
            maintenance: true
        },
        specialRequests: "Need to whitewash before moving in",
        contactNumber: "+91-9876543211"
    }
];