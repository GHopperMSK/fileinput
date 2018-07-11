<?php

use yii\helpers\Html;
use yii\web\JsExpression;

/* @var $this yii\web\View */
/* @var $multi boolean */
/* @var $field string */
/* @var $model yii\base\Model */

$fileFieldName = sprintf("%s[%s]%s", $model->formName(), $attribute, $multi ? '[]' : '');
$captionFieldName = sprintf("%s[%sName]%s", $model->formName(), $attribute, $multi ? '[]' : '');
?>

<div id="fileInput_<?= $id ?>" class="form-group field-<?= strtolower($model->formName()) ?>-<?= strtolower($attribute) ?>" >
    <div class="filesPreview"></div>
    <?= Html::tag('input', '', [
        'id' => strtolower($model->formName()) . '-' . strtolower($attribute),
        'type' => 'file',
        'name' => $fileFieldName,
        'multiple' => $multi,
    ]); ?>
</div>

<?php
$this->registerJs(new JsExpression("
    new fileInput({
        'id': '{$id}',
        'multi': " . json_encode($multi) . ",
        'captionTagName': '{$captionFieldName}',
        'initData': " . json_encode($initData) . "
    });
"), \yii\web\View::POS_READY);
?>