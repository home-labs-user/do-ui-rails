module InterfacesHtml
  module Rails
    class Engine < ::Rails::Engine
      isolate_namespace InterfacesHtml::Rails
    end
  end
end
