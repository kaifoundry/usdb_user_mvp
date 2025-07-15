
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <>
          {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 relative z-10">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>&copy; {currentYear} USDB Protocol. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  )
}
