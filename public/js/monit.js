// isi grid
const grid = new gridjs.Grid({
    columns: ['File Name', 'File Size', 'File Age', 'Date Modified', {
        name: 'Actions',
        formatter: (_, row) => gridjs.html(`
        <button type="button" class="btn btn-secondary" onclick="viewFile('${row.cells[0].data}', 0)">View</button>
        <button type="button" class="btn btn-secondary" onclick="downloadFile('${row.cells[0].data}', 0)">Download</button>
        `)
    }],
    sort: true,
    server: {
        url: '/api/monit?index=0',
        then: data => data.map(card => [card.name, card.size, card.age, card.datemod, null])
    }
}).render(document.getElementById("wrapper"))


// fungsi download
function downloadFile(name, pathIndex) {
    // location.href = "https://www.google.com"
    window.open(`/api/monit/download?index=${pathIndex}&name=${name}`, '_blank')
}

function udpateGrid(dropdownIndex) {
    grid.updateConfig({
        columns: ['File Name', 'File Size', 'File Age', 'Date Modified', {
            name: 'Actions',
            formatter: (_, row) => gridjs.html(`
            <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#viewlog">View</button>
            <button type="button" class="btn btn-secondary" onclick="downloadFile('${row.cells[0].data}', ${dropdownIndex})">Download</button>
            `)
        }],
        sort: true,
        server: {
            url: `/api/monit?index=${dropdownIndex}`,
            then: data => data.map(card => [card.name, card.size, card.age, card.datemod, null])
        }
    }).forceRender()

}

$('#dropdownList li').on('click', function() {
    udpateGrid($(this).index())
})

// show modal view file
async function viewFile(name, pathIndex) {
    // fetch data
    let response = await fetch(`/api/monit/viewfile?index=${pathIndex}&name=${name}`)
    let text = await response.text()
    var mymodal = $('#viewlog')
    mymodal.find('.modal-title').text("View log file: " + name)
    mymodal.find('.modal-body').html(text.replace(/\r?\n|\r/g, "<br>"))
    mymodal.modal('show')
}