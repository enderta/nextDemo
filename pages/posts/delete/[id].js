

export default function handler(req, res) {
    const {method} = req;
    const {client} = await connectDb();
    const id = req.query.id;

}