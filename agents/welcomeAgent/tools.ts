import { tool } from '@openai/agents/realtime'

export const authenticate_user_information = tool({
    name: "authenticate_user_information",
    description:
        "Look up a user's information with phone, last_4_cc_digits, last_4_ssn_digits, and date_of_birth to verify and authenticate the user. Should be run once the phone number and last 4 digits are confirmed.",
    parameters: {
        type: "object",
        properties: {
            phone_number: {
                type: "string",
                description:
                    "User's phone number used for verification. Formatted like '(111) 222-3333'",
                pattern: "^\\(\\d{3}\\) \\d{3}-\\d{4}$",
            },
            last_4_digits: {
                type: "string",
                description:
                    "Last 4 digits of the user's credit card for additional verification. Either this or 'last_4_ssn_digits' is required.",
            },
            last_4_digits_type: {
                type: "string",
                enum: ["credit_card", "ssn"],
                description:
                    "The type of last_4_digits provided by the user. Should never be assumed, always confirm.",
            },
            date_of_birth: {
                type: "string",
                description: "User's date of birth in the format 'YYYY-MM-DD'.",
                pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            },
        },
        required: [
            "phone_number",
            "date_of_birth",
            "last_4_digits",
            "last_4_digits_type",
        ],
        additionalProperties: false,
    },
    execute: async () => {
        return { success: true };
    },
})

export const save_or_update_address = tool({
    name: "save_or_update_address",
    description:
        "Saves or updates an address for a given phone number. Should be run only if the user is authenticated and provides an address. Only run AFTER confirming all details with the user.",
    parameters: {
        type: "object",
        properties: {
            phone_number: {
                type: "string",
                description: "The phone number associated with the address",
            },
            new_address: {
                type: "object",
                properties: {
                    street: {
                        type: "string",
                        description: "The street part of the address",
                    },
                    city: {
                        type: "string",
                        description: "The city part of the address",
                    },
                    state: {
                        type: "string",
                        description: "The state part of the address",
                    },
                    postal_code: {
                        type: "string",
                        description: "The postal or ZIP code",
                    },
                },
                required: ["street", "city", "state", "postal_code"],
                additionalProperties: false,
            },
        },
        required: ["phone_number", "new_address"],
        additionalProperties: false,
    },
    execute: async () => {
        return { success: true };
    },
})

export const update_user_offer_response = tool({
    name: "update_user_offer_response",
    description:
        "A tool definition for signing up a user for a promotional offer",
    parameters: {
        type: "object",
        properties: {
            phone: {
                type: "string",
                description: "The user's phone number for contacting them",
            },
            offer_id: {
                type: "string",
                description: "The identifier for the promotional offer",
            },
            user_response: {
                type: "string",
                description: "The user's response to the promotional offer",
                enum: ["ACCEPTED", "DECLINED", "REMIND_LATER"],
            },
        },
        required: ["phone", "offer_id", "user_response"],
        additionalProperties: false,
    },
    execute: async () => {
        return { success: true };
    },
})
