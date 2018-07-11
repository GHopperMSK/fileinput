var fileInput = function(options) {

    /**
     * Main Input element
     */
    let fileInput;

    /**
     * Image preview Div
     */
    let filesPreview;

    /**
     * File caption element name
     */
    let captionTagName;

    /**
     * Multi/single file
     */
    let multi;

    let root = this;

    /**
     * Constructor
     *
     * @param array
     */
    this.construct = function (options) {
        /**
         * Check for mandatory options
         */
        ['id', 'captionTagName', 'multi'].forEach(function (param) {
            if (typeof options[param] === 'undefined') {
                throw new Error(param + ' parameter is missed');
            }
        });

        root.id = options.id;
        root.multi = options.multi;
        root.captionTagName = options.captionTagName;

        root.fileInput = $("#fileInput_" + root.id + ">INPUT[type=file]");
        root.filesPreview = $("#fileInput_" + root.id + ">.filesPreview");

        if (('initData' in options) && options.initData && options.initData.length) {
            options.initData.forEach(function(item) {
                root.filesPreview.append(addUploadedItemPreview(item));
            })
        }

        root.fileInput.change(function() {
            onFileInputChange(this);
        });

    }

    function onFileInputChange(input) {
        if (root.multi) {
            // delete all unuploaded files
            root.filesPreview.find('.filePreview').has('input[type=text]:not([readonly])').remove();
        } else {
            root.filesPreview.html('');
        }

        if (input.files && input.files.length) {
            for(var i=0; i<input.files.length; i++) {
                var img = makePreviewItem(input.files[i]);
                readImage(input.files[i], img);
            }
        }
    }

    function readImage(file, img) {
        var reader = new FileReader();

        reader.onload = function(e) {
            img.src = reader.result;
        }
        reader.readAsDataURL(file);
    }

    function makePreviewItem(file) {
        var image  = new Image();
        let dimension = $('<p/>', {
            'text': image.width  + '×' + image.height
        });

        image.addEventListener("load", function (e) {
            // update stats
            dimension.text(this.width + 'x' + this.height);
        });

        var filePreview = $('<div/>', {
            class: 'filePreview'
        });
        filePreview.append($('<div/>').append(image));

        filePreview.append(dimension);

        filePreview.append($('<p/>', {
            'text': file.type
        }));

        filePreview.append($('<p/>', {
            'text': Math.round(file.size/1024) + 'KB'
        }));

        newFileName = fileNamePrepare(file.name);
        filePreview.append($('<input/>', {
            'type': 'text',
            'name': root.captionTagName,
            'class': 'form-control',
            'placeholder': 'Type the image caption...',
            'value': newFileName
        }));

        root.filesPreview.append(filePreview);

        return image;
    }

    function addUploadedItemPreview(data) {
        var filePreview = $('<div/>', {
            class: 'filePreview'
        });
        filePreview.append($('<div/>').append($('<img />', {
            'src': data.url
        })));

        filePreview.append($('<p/>', {
            'text': data.dimension
        }));

        filePreview.append($('<p/>', {
            'text': data.type
        }));

        filePreview.append($('<p/>', {
            'text': Math.round(data.size/1024) + 'KB'
        }));

        filePreview.append($('<input/>', {
            'type': 'text',
            'readonly': true,
            'name': root.captionTagName,
            'class': 'form-control',
            'placeholder': 'Type the image caption...',
            'value': data.name
        }));

        filePreview.append(
            $('<span/>', {
                'class': 'glyphicon glyphicon-remove',
                'click': removePreviewItem
            })
        );

        return filePreview;
    }

    // TODO: it should be kind of event
    function fileNamePrepare(name) {
        var resName = name.replace(/[^a-zA-Z0-9-_.]/g, '');
        return resName.toLowerCase();
    }

    function removePreviewItem(event) {
        event.target.parentElement.remove();
    }

    this.construct(options);
};