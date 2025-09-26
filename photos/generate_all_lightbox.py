import os
import glob

# City information with exact image counts and extensions from HTML analysis
city_data = {
    'Amsterdam': ('Amsterdam, Netherlands', 'July 2018', 38, '.jpeg'),
    'Barcelona': ('Barcelona, Spain', 'December 2016', 88, '.jpg'),
    'Brussels': ('Brussels, Belgium', 'July 2018', 15, '.jpeg'),
    'Edinburgh': ('Edinburgh, UK', 'July 2017', 24, '.jpg'),
    'Florence': ('Florence, Italy', 'July 2016', 73, '.jpeg'),  # From HTML
    'Hongkong': ('Hong Kong, China', 'September 2017', 1, '.jpg'),
    'Kyoto1': ('Kyoto, Japan', 'July 2014', 17, '.jpg'),
    'Kyoto2': ('Kyoto, Japan', 'December 2015', 60, '.jpeg'),  # From HTML
    'Kyoto3': ('Kyoto, Japan', 'October 2016', 38, '.jpeg'),  # From HTML
    'Kyushu': ('Kyushu, Japan', 'December 2018', 21, '.jpeg'),
    'LakeTahoe': ('Lake Tahoe, USA', 'April 2019', 15, '.jpeg'),
    'London': ('London, UK', 'July 2017', 27, '.jpg'),
    'LosAngeles': ('Los Angeles, USA', 'April 2019', 21, '.jpeg'),
    'Nagoya': ('Nagoya, Japan', 'August 2015', 12, '.jpeg'),  # From HTML
    'Napa': ('Napa, USA', 'February 2019', 15, '.jpeg'),
    'NewYork': ('NewYork, USA', 'September 2018', 63, '.jpeg'),
    'Okinawa': ('Okinawa, Japan', 'May 2014', 14, '.jpg'),
    'Paris': ('Paris, France', 'September 2015', 85, '.jpeg'),  # From HTML
    'Phiphi': ('Phi Phi, Thailand', 'September 2017', 14, '.jpeg'),
    'Rome': ('Rome, Italy', 'July 2016', 60, '.jpeg'),  # From HTML
    'Rotterdam': ('Rotterdam, Netherlands', 'July 2018', 27, '.jpeg'),
    'Sacramento': ('Sacramento, USA', 'April 2019', 15, '.jpeg'),
    'SanDiego': ('San Diego, USA', 'April 2019', 18, '.jpeg'),
    'SanFrancisco': ('San Francisco, USA', 'February-July 2019', 45, '.jpeg'),
    'Taipei': ('Taipei, Taiwan', 'December 2017', 13, '.jpeg'),
    'Tokyo1': ('Tokyo, Japan', 'August 2015', 27, '.jpg'),
    'Tokyo2': ('Tokyo, Japan', 'April 2017', 31, '.jpg'),
    'Tokyo3': ('Tokyo, Japan', 'November 2017', 47, '.jpeg')  # From HTML
}

def get_actual_image_count(city_dir, ext):
    """Get actual image count from existing lightbox.html if images don't exist"""
    photos_dir = '/Users/dongjunekim/junegood/photos'
    full_path = os.path.join(photos_dir, city_dir)
    lightbox_path = os.path.join(full_path, 'lightbox.html')

    if os.path.exists(lightbox_path):
        with open(lightbox_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Count img tags with the specific extension
            count = content.count(f'src="img/')
            # Get the highest number from the images
            import re
            numbers = re.findall(r'src="img/(\d+)\.' + ext.replace('.', ''), content)
            if numbers:
                return max(int(n) for n in numbers)
    return 0

def generate_lightbox_html(city_dir, city_name, date, img_count, ext):
    # Generate thumbnail images
    thumbnails = []
    figure_images = []

    for i in range(1, img_count + 1):
        thumbnails.append(f'\t\t\t<img class="thumb" src="img/{i}{ext}" onclick="lightbox_open({i})" alt="{city_name} {i}">')
        figure_images.append(f'\t\t\t\t<img src="img/{i}{ext}"{"" if i > 1 else " class=\"active\""}>')

    html = f'''<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>travels - {city_name}</title>
	<link rel="stylesheet" type="text/css" href="../css/lightbox-common.css">
	<script src="../js/jquery-3.5.1.min.js"></script>
</head>

<body>
	<header>
		<p><a href="../../sub3.html">travels</a></p>
		<p class="copy">All copyrights of photos reserved by Dongjune KIM</p>
		<div class="thumb-grid">
{chr(10).join(thumbnails)}
		</div>
	</header>

	<!-- 라이트 박스 배경  -->
	<div id="block"></div>

	<div id="lightbox">
		<div class="lightbox-header">
			<h1>{city_name}</h1>
			<p>{date}</p>
			<div class="photo-counter">
				<span id="currentPhoto">1</span> / <span id="totalPhotos">{img_count}</span>
			</div>
		</div>

		<div class="lightbox-content">
			<!-- Navigation buttons -->
			<button class="nav-btn prev" id="prevBtn" onclick="prevImage()">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="15 18 9 12 15 6"></polyline>
				</svg>
			</button>
			<button class="nav-btn next" id="nextBtn" onclick="nextImage()">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</button>

			<figure>
{chr(10).join(figure_images)}
			</figure>
		</div>

		<div class="btn-close" onclick="lightbox_close()">×</div>
	</div>

	<script src="../js/lightbox-common.js"></script>
</body>
</html>'''

    return html

# Generate for ALL cities
photos_dir = '/Users/dongjunekim/junegood/photos'
generated = []
failed = []

for city_dir, (city_name, date, expected_count, ext) in city_data.items():
    full_path = os.path.join(photos_dir, city_dir)

    if os.path.isdir(full_path):
        # Check actual images
        img_path = os.path.join(full_path, 'img')
        if os.path.exists(img_path):
            actual_files = glob.glob(os.path.join(img_path, f'*{ext}'))
            actual_count = len(actual_files)
        else:
            actual_count = 0

        # If no actual images but lightbox.html exists, use expected count
        if actual_count == 0:
            html_count = get_actual_image_count(city_dir, ext)
            if html_count > 0:
                actual_count = html_count
            else:
                actual_count = expected_count

        # Generate HTML
        html_content = generate_lightbox_html(city_dir, city_name, date, actual_count or expected_count, ext)

        # Write file
        output_path = os.path.join(full_path, 'lightbox-enhanced.html')
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

        generated.append(f'{city_dir}: {actual_count or expected_count} images ({ext})')
        print(f'✓ Created: {city_dir}/lightbox-enhanced.html ({actual_count or expected_count} {ext} images)')
    else:
        failed.append(city_dir)
        print(f'✗ Not found: {city_dir}')

print(f'\n✅ Successfully generated: {len(generated)} cities')
if failed:
    print(f'❌ Failed: {failed}')