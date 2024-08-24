export function NotFound() {
	return (
    <div className="flex flex-col items-center justify-center min-h-screen">
			<div class="text-center">
				<h1 class="text-6xl font-bold text-blue-600">404</h1>
				<p class="mt-4 text-2xl text-gray-200">Page Not Found</p>
				<a
					href="/"
					class="mt-6 inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
				>
					Go Back
				</a>
			</div>
		</div>
	);
}
