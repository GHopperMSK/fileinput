<?php

namespace ghopper\fileinput;

use yii\base\Widget;

/**
 * Class FileInputWidget
 * @package ghopper\fileinput
 */
class FileInputWidget extends Widget
{

    /**
     * @var boolean multi
     */
    public $multi;

    /**
     * @var yii\base\Model the data model that this widget is associated with
     */
    public $model;

    /**
     * @var string the model attribute that this widget is associated with.
     */
    public $attribute;

    public $initData;

    public function init()
    {
        $this->multi = isset($this->multi) ? (bool) $this->multi : false;

        parent::init();

    }

    public function run()
    {
        FileInputWidgetAsset::register($this->getView());

        return $this->render('default', [
            'id' => $this->getId(),
            'multi' => $this->multi,
            'model' => $this->model,
            'attribute' => $this->attribute,
            'initData' => $this->initData,
        ]);
    }
}

