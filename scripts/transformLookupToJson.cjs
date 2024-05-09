const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')

/**
 * This function reads a CSV file and transforms its content into a JSON object
 * that matches the format needed for TypeScript multipliers.
 * @param {string} csvFilePath Path to the CSV file.
 * @param {Function} callback Function to call with the result or an error.
 */
function parseCsvToMultipliers(csvFilePath, callback) {
  const parser = fs
    .createReadStream(csvFilePath)
    .pipe(parse({ delimiter: ',', from_line: 2 })) // Skip the first header line

  const multipliers = {}

  parser.on('data', (row) => {
    const crLabel = row[0].trim().replace(/^\D+/g, '') // First column is the CR label
    const data = row
      .slice(1)
      .map((value, index) => ({ [index + 1]: parseFloat(value) }))
    multipliers[crLabel] = Object.assign({}, ...data)
  })

  parser.on('end', () => {
    callback(null, multipliers)
  })

  parser.on('error', (error) => {
    callback(error)
  })
}

// Example usage:
const csvFilePath = path.join(
  path.resolve(__dirname),
  '../public/ratio_lookup_table.csv'
)

parseCsvToMultipliers(csvFilePath, (err, multipliers) => {
  if (err) {
    console.error('Error parsing CSV:', err)
    return
  }

  // Optionally write this to a file or handle further
  fs.writeFile(
    'app/lib/multipliers.json',
    JSON.stringify(multipliers, null, 2),
    (writeErr) => {
      if (writeErr) {
        console.error('Error writing file:', writeErr)
        return
      }
      console.log('Multipliers JSON file has been saved.')
    }
  )
})
