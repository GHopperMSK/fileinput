<?php

namespace ghopper\fileinput;

use yii\web\AssetBundle;

/**
 * Class SvgMapWidgetAsset
 * @package ghopper\fileinput
 */
class FileInputWidgetAsset extends AssetBundle
{
    public $sourcePath;

    public $css = [
        'css/file-input.css'
    ];

    public $js = [
        'js/file-input.js'
    ];

    public $depends = [
        'yii\web\JqueryAsset',
    ];

    public function init()
    {
        parent::init();

        $this->sourcePath = __DIR__ . '/src';
    }
}
