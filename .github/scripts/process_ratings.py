import os
import json
import requests
from datetime import datetime, timedelta
from collections import defaultdict
import sys

def get_cloudflare_ratings():
    """Fetch ratings from Cloudflare KV"""
    api_token = os.environ['CF_API_TOKEN']
    account_id = os.environ['CF_ACCOUNT_ID']
    namespace_id = os.environ['CF_KV_NAMESPACE_ID']
    
    # Get yesterday's date
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    key = f'ratings_{yesterday}'
    
    headers = {
        'Authorization': f'Bearer {api_token}',
        'Content-Type': 'application/json'
    }
    
    url = f'https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{key}'
    
    response = requests.get(url, headers=headers)
    if response.status_code == 404:
        return []  # No ratings for yesterday
    
    response.raise_for_status()
    return response.json()

def update_blend_ratings(blend_data, new_rating):
    """Update blend ratings with a new rating submission"""
    
    # Update overall rating statistics
    blend_data['totalReviews'] += 1
    
    # Convert rating to star category
    rating_value = float(new_rating['rating'])
    if rating_value % 1 == 0:
        star_category = f"{int(rating_value)}_star"
    else:
        if rating_value < 1:
            star_category = "half_star"
        else:
            star_category = f"{int(rating_value)}half_star"
    
    blend_data['ratingDistribution'][star_category] += 1
    
    # Recalculate average rating
    total_stars = sum(
        float(k.replace('half_star', '.5').replace('_star', '')) * v 
        for k, v in blend_data['ratingDistribution'].items()
    )
    blend_data['averageRating'] = round(total_stars / blend_data['totalReviews'], 2)
    
    # Update profile ratings
    for profile_type, rating_value in new_rating['profiles'].items():
        profile_data = blend_data['ratings'][profile_type]
        distribution = profile_data['distribution']
        
        # Count current ratings
        total_per_level = defaultdict(int)
        for level, normalized_value in distribution.items():
            # De-normalize the value to get original count
            max_value = max(distribution.values())
            if max_value > 0:
                count = int(round((normalized_value * 100 / max_value)))
                total_per_level[level] = count
        
        # Add new rating
        total_per_level[rating_value] += 1
        
        # Re-normalize all values
        max_count = max(total_per_level.values())
        for level in distribution:
            if max_count > 0:
                normalized_value = (total_per_level[level] / max_count) * 100
                distribution[level] = round(normalized_value, 10)
        
        # Update the most common level
        profile_data['level'] = max(total_per_level.items(), key=lambda x: (x[1], x[0]))[0]

    return blend_data

def main():
    blend_file = sys.argv[1]
    rating_data = json.loads(sys.argv[2])
    
    with open(blend_file, 'r') as f:
        blend_json = json.load(f)
    
    # Get blend key (first key in the JSON)
    blend_key = next(iter(blend_json))
    blend_data = blend_json[blend_key]
    
    # Update the ratings
    updated_blend = update_blend_ratings(blend_data, rating_data)
    blend_json[blend_key] = updated_blend
    
    # Write back to file
    with open(blend_file, 'w') as f:
        json.dump(blend_json, f, indent=4)

if __name__ == "__main__":
    main() 