export default function MenuCard({ image, title, description, price }) {
    return (
        <div className="bg-white shadow rounded-xl p-4">
            <img src={image} alt={title} className="rounded-xl w-full h-48 object-cover" />
            <h3 className="text-xl font-semibold mt-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="text-lg font-bold mt-2">${price}</div>
        </div>
    );
}
