const softwareSyncUrl =
    process.env.SOFTWARE_SERVICE_SYNC_URL ||
    "http://software-service:3000/api/internal/users/sync";

async function syncSoftwareUser(uuid, email) {
    if (!uuid) {
        throw new Error("User uuid is required");
    }

    const response = await fetch(softwareSyncUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid, email }),
    });

    if (!response.ok) {
        let message = "Unable to sync software user";

        try {
            const body = await response.json();
            if (body.message) {
                message = body.message;
            }
        } catch (_err) {
            // Keep the generic message when software returns no JSON body.
        }

        throw new Error(message);
    }
}

module.exports = {
    syncSoftwareUser,
};
