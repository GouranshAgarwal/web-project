function addNote() {
    var memoTextarea = document.getElementById('memo');
    var memo = memoTextarea.value;

    if (memo.trim() !== '') {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'backend.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                memoTextarea.value = '';
            }
        };
        xhr.send('action=add&memo=' + encodeURIComponent(memo));
    }
}

function searchNotes() {
    var phrase = document.getElementById('searchPhrase').value;

    if (phrase.trim() !== '') {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'backend.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var result = JSON.parse(xhr.responseText);
                if (result.message === 'Phrase found') {
                    alert(`Phrase found ${result.count} times in the following notes:\n${result.notes.join('\n')}`);
                } else {
                    alert('Phrase not found');
                }
                document.getElementById('searchPhrase').value = '';
            }
        };
        xhr.send('action=search&phrase=' + encodeURIComponent(phrase));
    }
}

function showAllNotes() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'backend.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(xhr.responseText);
            var notesText = result.notes.map(function (note, index) {
                var date = new Date(note.timestamp);
                var formattedDate = date.toLocaleString();
                return `${index + 1}. ${note.memo} (Created on: ${formattedDate})`;
            }).join('\n');

            var newWindow = window.open('', '_blank');
            newWindow.document.write('<html><head><title>All Notes</title></head><body><pre>' + notesText + '</pre></body></html>');
        }
    };
    xhr.send('action=showAll');
}
