![FileInput](https://image.ibb.co/gDKbp8/Screenshot_20180711_105749.png "Yii2 widget for images uploading")


# FileInput

Yii2 widget for images uploading 

Lightweight widget with base functionality in just a few lines of code. Without ajax, without wide customization.

## Install

```
php composer.phar require "ghopper/fileinput:@dev"
```
or add to composer.json
```json
{
    "require": {
        "ghopper/fileinput": "@dev"
    }
}
```

## Usage

### view
```php
<?php
use ghopper\fileinput\FileInputWidget;
...
$imageInitData = [];

// prepare initial data to be shown
$images = $model->images;
if (is_array($images) && count($images)) {
    foreach ($images as $image) {
        $imageInitData[] = [
            'name' => $image->name,
            'url' => $image->url,
            'size' => $image->getSize(),
            'type' => $image->getType(),
            'dimension' => implode('x', $image->getDimension()),
        ];
    }
}
?>
...

<h2>Images</h2>
<?= $form->field($item, 'uploadedFiles')->widget(FileInputWidget::className(), [
    'multi' => true,
    'initData' => $imageInitData,
]) ?>

...
```

### model
```php
    /**
     * Files, obtained from the web form
     * @var UploadedFile[]
     */
    public $uploadedFiles;

    /**
     * Obtained file names
     *
     * @var string[]
     */
    public $uploadedFilesName;

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['uploadedFilesName'], 'safe'],
            [['uploadedFiles'], 'image',
                'minWidth' => self::IMG_MIN_WIDTH,
                'minHeight' => self::IMG_MIN_HEIGHT,
                'extensions' => 'png, jpg',
                'maxFiles' => 6,
                'maxSize' => 1024 * 1024 * 2
            ],
        ];
    }

```

### controller
Now you can get all the data inside the controller:
```php
$uploadedImages = UploadedFile::getInstances($model, 'uploadedFiles'); // files itself
$uploadedImageLabels = $model->uploadedFilesName; // file labels
```

With two arrays (just uploaded files and file labels (both already uploaded and new ones)) you can manage server-side files. Delete server file if appropriate label doen't exists.
```php
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->validate()) {

            $model->uploadedFiles = UploadedFile::getInstances($model, 'uploadedFiles');
            $transaction = Yii::$app->db->beginTransaction();
            try {
                if ($model->save(false)) {

                    // remove images from the server
                    $currentImagesCount = 0;
                    $currentImages = $model->images; // get current images
                    foreach ($currentImages as $key => $img) {
                        if (!in_array($img->name, $model->uploadedFilesName)) {
                            // delete if it were deleted on web
                            $img->delete();
                        } else {
                            // update file pos
                            if ($img->pos !== $key) {
                                $img->pos = $key;
                                $img->update();
                            }

                            // increase uploaded files counter
                            $currentImagesCount++;
                        }
                    }

                    /** @var $images Image[] */
                    $images = $this->loadImageModels($model, $currentImagesCount);
                    foreach($images as $image) {
                        $image->saveImage();
                    }

                    $transaction->commit();
                    return $this->redirect(['view', 'id' =item> $item->id]);
                }
            } catch (\Exception $exc) {
            ...
            }
        }
    }
    
    /**
     * @param Model $model
     * @return Image[]
     */
    private function loadImageModels(Model $model, $curIndex = 0)
    {
        $images = [];
        $uploadedImages = (is_array($model->uploadedFiles) && count($model->uploadedFiles))
            ? $model->uploadedFiles
            : [];

        foreach ($uploadedImages as $key => $file) {
            $img = new Image();
            ...
            $img->pos = $key + $curIndex;
            $img->uploadedFile = $file;
            $img->uploadedFileName = $model->uploadedFilesName[$curIndex + $key];
            $images[] = $img;
        }

        return $images;
    }
    
```