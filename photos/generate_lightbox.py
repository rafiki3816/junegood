import os
import glob

# City information - name, date
city_info = {
    'Amsterdam': ('Amsterdam, Netherlands', 'July 2018'),
    'Barcelona': ('Barcelona, Spain', 'December 2016'),
    'Brussels': ('Brussels, Belgium', 'July 2018'),
    'Edinburgh': ('Edinburgh, UK', 'July 2017'),
    'Florence': ('Florence, Italy', 'July 2016'),
    'Hongkong': ('Hong Kong, China', 'September 2017'),
    'Kyoto1': ('Kyoto, Japan', 'July 2014'),
    'Kyoto2': ('Kyoto, Japan', 'December 2015'),
    'Kyoto3': ('Kyoto, Japan', 'October 2016'),
    'Kyushu': ('Kyushu, Japan', 'December 2018'),
    'LakeTahoe': ('Lake Tahoe, USA', 'April 2019'),
    'London': ('London, UK', 'July 2017'),
    'LosAngeles': ('Los Angeles, USA', 'April 2019'),
    'Nagoya': ('Nagoya, Japan', 'August 2015'),
    'Napa': ('Napa, USA', 'February 2019'),
    'NewYork': ('NewYork, USA', 'September 2018'),
    'Okinawa': ('Okinawa, Japan', 'May 2014'),
    'Paris': ('Paris, France', 'September 2015'),
    'Phiphi': ('Phi Phi, Thailand', 'September 2017'),
    'Rome': ('Rome, Italy', 'July 2016'),
    'Rotterdam': ('Rotterdam, Netherlands', 'July 2018'),
    'Sacramento': ('Sacramento, USA', 'April 2019'),
    'SanDiego': ('San Diego, USA', 'April 2019'),
    'SanFrancisco': ('San Francisco, USA', 'February-July 2019'),
    'Taipei': ('Taipei, Taiwan', 'December 2017'),
    'Tokyo1': ('Tokyo, Japan', 'August 2015'),
    'Tokyo2': ('Tokyo, Japan', 'April 2017'),
    'Tokyo3': ('Tokyo, Japan', 'November 2017')
}

def generate_lightbox_html(city_dir, img_count, city_name, date):
    # Generate thumbnail images
    thumbnails = []
    figure_images = []

    for i in range(1, img_count + 1):
        thumbnails.append(f'\t\t\t<img class="thumb" src="img/{i}.jpg" onclick="lightbox_open({i})" alt="{city_name} {i}">')
        figure_images.append(f'\t\t\t\t<img src="img/{i}.jpg"{"" if i > 1 else " class=\"active\""}>')

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

# Generate for each city with images
photos_dir = '/Users/dongjunekim/junegood/photos'

for city_dir in sorted(os.listdir(photos_dir)):
    full_path = os.path.join(photos_dir, city_dir)
    if os.path.isdir(full_path) and city_dir not in ['css', 'js']:
        img_path = os.path.join(full_path, 'img')
        if os.path.exists(img_path):
            jpg_files = glob.glob(os.path.join(img_path, '*.jpg'))
            count = len(jpg_files)

            if count > 0:
                # Get city info
                if city_dir in city_info:
                    city_name, date = city_info[city_dir]
                else:
                    city_name = city_dir
                    date = "Date Unknown"

                # Generate HTML
                html_content = generate_lightbox_html(city_dir, count, city_name, date)

                # Write file
                output_path = os.path.join(full_path, 'lightbox-enhanced.html')
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(html_content)

                print(f'Created: {city_dir}/lightbox-enhanced.html ({count} images)')