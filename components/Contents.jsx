export default function Contents({ body }) {
  return (
    <div
      className="sm:w-4/5 md:w-11/12 p-3 mx-auto"
      style={{ minHeight: '85vh' }}
    >
      {body}
    </div>
  )
}
