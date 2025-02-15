const fs = require('fs');
const path = require('path');

// Read all blend files and create a comprehensive index
async function generateBlendIndex() {
    const blendDir = path.join(__dirname, '..', 'blend_data');
    const indexFile = path.join(__dirname, '..', 'assets', 'data', 'blend_index.json');
    const metadataFile = path.join(__dirname, '..', 'assets', 'data', 'blend_metadata.json');
    const blendedByFile = path.join(__dirname, '..', 'assets', 'data', 'blended_by.json');
    const manufacturedByFile = path.join(__dirname, '..', 'assets', 'data', 'manufactured_by.json');
    
    // Create assets/data directory if it doesn't exist
    const dataDir = path.dirname(indexFile);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const blendIndex = {};
    const metadata = {
        blenders: new Set(),
        blendedBy: new Set(),
        manufacturedBy: new Set(),
        countries: new Set(),
        blendTypes: new Set(),
        contents: new Set(),
        cuts: new Set(),
        packagings: new Set(),
        flavorings: new Set(),
        productionTypes: new Set()
    };

    const files = fs.readdirSync(blendDir);

    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        try {
            const content = fs.readFileSync(path.join(blendDir, file), 'utf8');
            const data = JSON.parse(content);
            const key = Object.keys(data)[0];
            const blend = data[key];

            // Populate metadata sets
            if (blend.blender) metadata.blenders.add(blend.blender);
            if (blend.blendedBy) metadata.blendedBy.add(blend.blendedBy);
            if (blend.manufacturedBy) metadata.manufacturedBy.add(blend.manufacturedBy);
            if (blend.country) metadata.countries.add(blend.country);
            if (blend.blendType) metadata.blendTypes.add(blend.blendType);
            if (blend.contents) metadata.contents.add(blend.contents);
            if (blend.cut) metadata.cuts.add(blend.cut);
            if (blend.packaging) metadata.packagings.add(blend.packaging);
            if (blend.flavoring) metadata.flavorings.add(blend.flavoring);
            if (blend.production) metadata.productionTypes.add(blend.production);

            // Prepare compact ratings data
            const ratingsData = {
                s: blend.ratings?.strength ? {
                    l: blend.ratings.strength.level || 'Medium',
                    d: blend.ratings.strength.distribution ? Object.fromEntries(
                        Object.entries(blend.ratings.strength.distribution).map(([k, v]) => [
                            k === 'Extremely Mild' ? 'EM' :
                            k === 'Very Mild' ? 'VM' :
                            k === 'Mild' ? 'M' :
                            k === 'Mild to Medium' ? 'MM' :
                            k === 'Medium' ? 'Med' :
                            k === 'Medium to Strong' ? 'MS' :
                            k === 'Strong' ? 'S' :
                            k === 'Very Strong' ? 'VS' :
                            k === 'Extremely Strong' ? 'ES' :
                            k === 'Overwhelming' ? 'O' : k
                        , v])
                    ) : {}
                } : null,
                f: blend.ratings?.flavoring ? {
                    l: blend.ratings.flavoring.level || 'Medium',
                    d: blend.ratings.flavoring.distribution ? Object.fromEntries(
                        Object.entries(blend.ratings.flavoring.distribution).map(([k, v]) => [
                            k === 'None Detected' ? 'ND' :
                            k === 'Extremely Mild' ? 'EM' :
                            k === 'Very Mild' ? 'VM' :
                            k === 'Mild' ? 'M' :
                            k === 'Mild to Medium' ? 'MM' :
                            k === 'Medium' ? 'Med' :
                            k === 'Medium to Strong' ? 'MS' :
                            k === 'Strong' ? 'S' :
                            k === 'Very Strong' ? 'VS' :
                            k === 'Extra Strong' ? 'ES' : k
                        , v])
                    ) : {}
                } : null,
                r: blend.ratings?.roomNote ? {
                    l: blend.ratings.roomNote.level || 'Very Pleasant',
                    d: blend.ratings.roomNote.distribution ? Object.fromEntries(
                        Object.entries(blend.ratings.roomNote.distribution).map(([k, v]) => [
                            k === 'Unnoticeable' ? 'UN' :
                            k === 'Pleasant' ? 'P' :
                            k === 'Very Pleasant' ? 'VP' :
                            k === 'Pleasant to Tolerable' ? 'PT' :
                            k === 'Tolerable' ? 'T' :
                            k === 'Tolerable to Strong' ? 'TS' :
                            k === 'Strong' ? 'S' :
                            k === 'Very Strong' ? 'VS' :
                            k === 'Extra Strong' ? 'ES' :
                            k === 'Overwhelming' ? 'O' : k
                        , v])
                    ) : {}
                } : null,
                t: blend.ratings?.taste ? {
                    l: blend.ratings.taste.level || 'Mild to Medium',
                    d: blend.ratings.taste.distribution ? Object.fromEntries(
                        Object.entries(blend.ratings.taste.distribution).map(([k, v]) => [
                            k === 'Extremely Mild (Flat)' ? 'EMF' :
                            k === 'Very Mild' ? 'VM' :
                            k === 'Mild' ? 'M' :
                            k === 'Mild to Medium' ? 'MM' :
                            k === 'Medium' ? 'Med' :
                            k === 'Medium to Full' ? 'MF' :
                            k === 'Full' ? 'F' :
                            k === 'Very Full' ? 'VF' :
                            k === 'Extra Full' ? 'EF' :
                            k === 'Overwhelming' ? 'O' : k
                        , v])
                    ) : {}
                } : null
            };

            // Store comprehensive data for each blend
            blendIndex[file] = {
                n: blend.name || '',          // name
                b: blend.blender || '',       // blender
                bb: blend.blendedBy || '',    // blended by
                mb: blend.manufacturedBy || '', // manufactured by
                t: blend.blendType || '',     // type
                c: blend.contents || '',      // contents
                ct: blend.cut || '',          // cut
                y: blend.country || '',       // country
                p: blend.packaging || '',     // packaging
                f: blend.flavoring || '',     // flavoring
                pr: blend.production || '',   // production
                r: blend.averageRating || 0,  // rating (numeric for sorting)
                mr: blend.maxRating || 5,     // max rating
                rc: blend.reviewCount || 0,   // review count
                rd: blend.ratingDistribution ? {
                    '4': blend.ratingDistribution['4_star'] || 0,
                    '3': blend.ratingDistribution['3_star'] || 0,
                    '2': blend.ratingDistribution['2_star'] || 0,
                    '1': blend.ratingDistribution['1_star'] || 0
                } : {
                    '4': 0,
                    '3': 0,
                    '2': 0,
                    '1': 0
                },
                rt: ratingsData  // ratings
            };
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }

    // Convert sets to sorted arrays for metadata
    const processedMetadata = {
        blenders: Array.from(metadata.blenders).sort(),
        blendedBy: Array.from(metadata.blendedBy).sort(),
        manufacturedBy: Array.from(metadata.manufacturedBy).sort(),
        countries: Array.from(metadata.countries).sort(),
        blendTypes: Array.from(metadata.blendTypes).sort(),
        contents: Array.from(metadata.contents).sort(),
        cuts: Array.from(metadata.cuts).sort(),
        packagings: Array.from(metadata.packagings).sort(),
        flavorings: Array.from(metadata.flavorings).sort(),
        productionTypes: Array.from(metadata.productionTypes).sort()
    };

    // Write the index and metadata files with standard JSON formatting
    fs.writeFileSync(indexFile, JSON.stringify(blendIndex, null, 2), { encoding: 'utf8' });
    fs.writeFileSync(metadataFile, JSON.stringify(processedMetadata, null, 2), { encoding: 'utf8' });
    fs.writeFileSync(blendedByFile, JSON.stringify(processedMetadata.blendedBy, null, 2), { encoding: 'utf8' });
    fs.writeFileSync(manufacturedByFile, JSON.stringify(processedMetadata.manufacturedBy, null, 2), { encoding: 'utf8' });
    
    console.log(`Index file created at ${indexFile}`);
    console.log(`Metadata file created at ${metadataFile}`);
    console.log(`Blended by file created at ${blendedByFile}`);
    console.log(`Manufactured by file created at ${manufacturedByFile}`);
}

generateBlendIndex().catch(console.error);
