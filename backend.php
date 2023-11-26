<?php
class Note {
    private $notesFile = 'notes.txt';

    public function add($memo) {
        $this->loadNotes();
        $timestamp = date('Y-m-d H:i:s');
        $this->all_notes[] = ['memo' => $memo, 'timestamp' => $timestamp];        
        $this->saveNotes();
    }

    public function search($phrase) {
        $this->loadNotes();
    
        $count = 0;
        $foundNotes = [];
    
        foreach ($this->all_notes as $index => $note) {
            if (strpos($note['memo'], $phrase) !== false) {
                $count++;
                $foundNotes[] = "Note ID: " . ($index + 1) . " - " . $note['memo'];
            }
        }
    
        $result = ['message' => ($count > 0) ? 'Phrase found' : 'Phrase not found', 'count' => $count, 'notes' => $foundNotes];
        echo json_encode($result);
    }
    
    public function showAll() {
        $this->loadNotes();
        $limitedNotes = array_slice($this->all_notes, 0, 10);
        echo json_encode(['notes' => $limitedNotes]);
    }

    private function loadNotes() {
        if (file_exists($this->notesFile)) {
            $content = file_get_contents($this->notesFile);
            $this->all_notes = json_decode($content, true) ?: [];
        } else {
            $this->all_notes = [];
        }
    }

    private function saveNotes() {
        file_put_contents($this->notesFile, json_encode($this->all_notes));
    }
}

$note = new Note();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    switch ($action) {
        case 'add':
            $memo = $_POST['memo'];
            $note->add($memo);
            break;

        case 'search':
            $phrase = $_POST['phrase'];
            $note->search($phrase);
            break;

        case 'showAll':
            $note->showAll();
            break;
    }
}
?>
