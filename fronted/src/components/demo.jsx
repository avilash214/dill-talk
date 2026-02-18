import { subDays } from 'date-fns'; // Import date-fns to calculate the date 30 days ago

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const thirtyDaysAgo = subDays(new Date(), 30); // Calculate the date 30 days ago

        // Fetch the conversation and filter messages from the last 30 days
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate({
            path: 'messages',
            match: { createdAt: { $gte: thirtyDaysAgo } } // Filter messages from the last 30 days
        });

        if (!conversation) return res.status(200).json({ success: true, messages: [] });

        // Delete messages older than 30 days
        await Message.deleteMany({
            _id: { $in: conversation.messages.map(msg => msg._id) },
            createdAt: { $lt: thirtyDaysAgo }
        });

        // Refetch the conversation to get the updated messages
        conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        return res.status(200).json({ success: true, messages: conversation?.messages });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
