const stripe = require('stripe')(process.env.STRIPE_API_KEY);

async function createOrRetrieveCustomer(userId, userDetails) {
    try {
        // Check if the customer with the given userID exists
        const existingCustomers = await stripe.customers.list({
            limit: 1,
        });

        let customer;

        if (existingCustomers.data.length === 0) {
            // If customer doesn't exist, create a new customer
            customer = await stripe.customers.create({
                metadata: {
                    user_id: userId,
                },
                ...userDetails, // Additional customer details (e.g., email, name)
            });
        } else {
            // If customer exists, retrieve the existing customer
            customer = existingCustomers.data[0];
        }

        return customer;
    } catch (error) {
        throw error;
    }
}


module.exports = createOrRetrieveCustomer;